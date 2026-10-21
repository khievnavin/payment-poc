import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AccountService } from '../account/account.service';
import { Account, AccountStatus } from '../account/entities/account.entity';
import { CreateTransferDto } from './dto/create-transfer.dto';
import {
  StepStatus,
  TRANSFER_PIPELINE,
  Transfer,
  TransferStatus,
  TransferStep,
} from './entities/transfer.entity';

// Largest single transfer allowed, in the sender's currency units.
export const MAX_TRANSFER_AMOUNT = 10_000;

class StepFailure extends Error {
  constructor(
    readonly step: TransferStep,
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

@Injectable()
export class TransferService {
  // In-memory store for now — swap for a real DB repository later.
  private readonly transfers = new Map<string, Transfer>();

  constructor(private readonly accountService: AccountService) {}

  // Always records the attempt, even when it fails, so both users can see
  // what happened. Check `status` / `failure` on the result.
  create(dto: CreateTransferDto): Promise<Transfer> {
    const now = new Date();
    const transfer: Transfer = {
      id: randomUUID(),
      fromAccountId: dto.fromAccountId,
      toAccountId: dto.toAccountId,
      amount: dto.amount,
      note: dto.note,
      status: TransferStatus.PROCESSING,
      receiverCredited: false,
      steps: [],
      createdAt: now,
      updatedAt: now,
    };
    this.transfers.set(transfer.id, transfer);

    this.process(transfer, dto.simulateFailureAt);

    transfer.updatedAt = new Date();
    return Promise.resolve(transfer);
  }

  findAll(accountId?: string): Promise<Transfer[]> {
    const all = Array.from(this.transfers.values());
    return Promise.resolve(
      accountId
        ? all.filter(
            (t) => t.fromAccountId === accountId || t.toAccountId === accountId,
          )
        : all,
    );
  }

  findOne(id: string): Promise<Transfer> {
    const transfer = this.transfers.get(id);
    if (!transfer) {
      throw new NotFoundException(`Transfer ${id} not found`);
    }
    return Promise.resolve(transfer);
  }

  // Runs synchronously: there is no await between the funds check and the
  // debit, so two transfers can't both spend the same balance.
  private process(transfer: Transfer, simulateFailureAt?: TransferStep) {
    let sender: Account | undefined;
    let receiver: Account | undefined;
    let debited = false;

    const run = (step: TransferStep, fn: () => string) => {
      if (simulateFailureAt === step) {
        throw new StepFailure(
          step,
          'SIMULATED_FAILURE',
          `Simulated failure at ${step}`,
        );
      }
      const message = fn();
      transfer.steps.push({
        step,
        status: StepStatus.OK,
        message,
        at: new Date(),
      });
    };

    try {
      run(TransferStep.VALIDATE, () => {
        if (transfer.fromAccountId === transfer.toAccountId) {
          throw new StepFailure(
            TransferStep.VALIDATE,
            'SAME_ACCOUNT',
            'Sender and receiver must be different accounts',
          );
        }
        return 'Request is valid';
      });

      run(TransferStep.CHECK_SENDER, () => {
        sender = this.accountService.get(transfer.fromAccountId);
        if (!sender) {
          throw new StepFailure(
            TransferStep.CHECK_SENDER,
            'SENDER_NOT_FOUND',
            `Sender account ${transfer.fromAccountId} does not exist`,
          );
        }
        transfer.currency = sender.currency;
        if (sender.status !== AccountStatus.ACTIVE) {
          throw new StepFailure(
            TransferStep.CHECK_SENDER,
            'SENDER_ACCOUNT_FROZEN',
            `Sender account ${sender.name} is ${sender.status}`,
          );
        }
        return `Sender ${sender.name} is active`;
      });

      run(TransferStep.CHECK_RECEIVER, () => {
        receiver = this.accountService.get(transfer.toAccountId);
        if (!receiver) {
          throw new StepFailure(
            TransferStep.CHECK_RECEIVER,
            'RECEIVER_NOT_FOUND',
            `Receiver account ${transfer.toAccountId} does not exist`,
          );
        }
        if (receiver.status !== AccountStatus.ACTIVE) {
          throw new StepFailure(
            TransferStep.CHECK_RECEIVER,
            'RECEIVER_ACCOUNT_FROZEN',
            `Receiver account ${receiver.name} is ${receiver.status}`,
          );
        }
        if (receiver.currency !== sender!.currency) {
          throw new StepFailure(
            TransferStep.CHECK_RECEIVER,
            'CURRENCY_MISMATCH',
            `Receiver holds ${receiver.currency}, sender holds ${sender!.currency}`,
          );
        }
        return `Receiver ${receiver.name} is active and accepts ${receiver.currency}`;
      });

      run(TransferStep.CHECK_LIMIT, () => {
        if (transfer.amount > MAX_TRANSFER_AMOUNT) {
          throw new StepFailure(
            TransferStep.CHECK_LIMIT,
            'LIMIT_EXCEEDED',
            `Amount ${transfer.amount} exceeds the per-transfer limit of ${MAX_TRANSFER_AMOUNT}`,
          );
        }
        return `Within the ${MAX_TRANSFER_AMOUNT} per-transfer limit`;
      });

      run(TransferStep.CHECK_FUNDS, () => {
        if (sender!.balance < transfer.amount) {
          throw new StepFailure(
            TransferStep.CHECK_FUNDS,
            'INSUFFICIENT_FUNDS',
            `Sender balance ${sender!.balance} is less than ${transfer.amount}`,
          );
        }
        return `Sender has ${sender!.balance} available`;
      });

      run(TransferStep.DEBIT_SENDER, () => {
        this.accountService.debit(sender!, transfer.amount);
        debited = true;
        return `Debited ${transfer.amount} from ${sender!.name}`;
      });

      run(TransferStep.CREDIT_RECEIVER, () => {
        this.accountService.credit(receiver!, transfer.amount);
        transfer.receiverCredited = true;
        return `Credited ${transfer.amount} to ${receiver!.name}`;
      });

      transfer.status = TransferStatus.COMPLETED;
    } catch (err) {
      const failure =
        err instanceof StepFailure
          ? err
          : new StepFailure(
              TRANSFER_PIPELINE[transfer.steps.length],
              'INTERNAL_ERROR',
              err instanceof Error ? err.message : String(err),
            );

      transfer.failure = {
        step: failure.step,
        code: failure.code,
        message: failure.message,
      };
      transfer.steps.push({
        step: failure.step,
        status: StepStatus.FAILED,
        message: failure.message,
        at: new Date(),
      });

      const failedIndex = TRANSFER_PIPELINE.indexOf(failure.step);
      for (const step of TRANSFER_PIPELINE.slice(failedIndex + 1)) {
        transfer.steps.push({
          step,
          status: StepStatus.SKIPPED,
          message: `Not run: stopped at ${failure.step}`,
          at: new Date(),
        });
      }

      if (debited) {
        // Money already left the sender: put it back.
        this.accountService.credit(sender!, transfer.amount);
        transfer.steps.push({
          step: TransferStep.REVERSE_DEBIT,
          status: StepStatus.OK,
          message: `Returned ${transfer.amount} to ${sender!.name}`,
          at: new Date(),
        });
        transfer.status = TransferStatus.REVERSED;
      } else {
        transfer.status = TransferStatus.FAILED;
      }
    }
  }
}
