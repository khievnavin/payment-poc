import { AccountService } from '../account/account.service';
import {
  StepStatus,
  TransferStatus,
  TransferStep,
} from './entities/transfer.entity';
import { TransferService } from './transfer.service';

describe('TransferService', () => {
  let accounts: AccountService;
  let transfers: TransferService;

  beforeEach(() => {
    accounts = new AccountService();
    transfers = new TransferService(accounts);
  });

  const balance = (id: string) => accounts.get(id)!.balance;

  it('moves money from sender to receiver', async () => {
    const t = await transfers.create({
      fromAccountId: 'user-1',
      toAccountId: 'user-2',
      amount: 25.5,
    });

    expect(t.status).toBe(TransferStatus.COMPLETED);
    expect(t.receiverCredited).toBe(true);
    expect(t.failure).toBeUndefined();
    expect(t.steps.every((s) => s.status === StepStatus.OK)).toBe(true);
    expect(balance('user-1')).toBe(474.5);
    expect(balance('user-2')).toBe(125.5);
  });

  it('fails at CHECK_FUNDS without touching balances', async () => {
    const t = await transfers.create({
      fromAccountId: 'user-2',
      toAccountId: 'user-1',
      amount: 1000,
    });

    expect(t.status).toBe(TransferStatus.FAILED);
    expect(t.failure).toMatchObject({
      step: TransferStep.CHECK_FUNDS,
      code: 'INSUFFICIENT_FUNDS',
    });
    expect(
      t.steps.filter((s) => s.status === StepStatus.SKIPPED).map((s) => s.step),
    ).toEqual([TransferStep.DEBIT_SENDER, TransferStep.CREDIT_RECEIVER]);
    expect(balance('user-1')).toBe(500);
    expect(balance('user-2')).toBe(100);
  });

  it.each([
    ['user-1', 'user-1', TransferStep.VALIDATE, 'SAME_ACCOUNT'],
    ['nobody', 'user-2', TransferStep.CHECK_SENDER, 'SENDER_NOT_FOUND'],
    ['user-4', 'user-2', TransferStep.CHECK_SENDER, 'SENDER_ACCOUNT_FROZEN'],
    ['user-1', 'nobody', TransferStep.CHECK_RECEIVER, 'RECEIVER_NOT_FOUND'],
    [
      'user-1',
      'user-4',
      TransferStep.CHECK_RECEIVER,
      'RECEIVER_ACCOUNT_FROZEN',
    ],
    ['user-1', 'user-3', TransferStep.CHECK_RECEIVER, 'CURRENCY_MISMATCH'],
  ])('%s -> %s fails at %s with %s', async (from, to, step, code) => {
    const t = await transfers.create({
      fromAccountId: from,
      toAccountId: to,
      amount: 10,
    });
    expect(t.status).toBe(TransferStatus.FAILED);
    expect(t.failure).toMatchObject({ step, code });
  });

  it('rejects amounts over the per-transfer limit', async () => {
    await accounts.deposit('user-1', 20_000);
    const t = await transfers.create({
      fromAccountId: 'user-1',
      toAccountId: 'user-2',
      amount: 10_001,
    });
    expect(t.failure).toMatchObject({
      step: TransferStep.CHECK_LIMIT,
      code: 'LIMIT_EXCEEDED',
    });
  });

  it('reverses the debit when crediting the receiver fails', async () => {
    const t = await transfers.create({
      fromAccountId: 'user-1',
      toAccountId: 'user-2',
      amount: 40,
      simulateFailureAt: TransferStep.CREDIT_RECEIVER,
    });

    expect(t.status).toBe(TransferStatus.REVERSED);
    expect(t.receiverCredited).toBe(false);
    expect(t.failure?.step).toBe(TransferStep.CREDIT_RECEIVER);
    expect(t.steps.map((s) => [s.step, s.status]).slice(-3)).toEqual([
      [TransferStep.DEBIT_SENDER, StepStatus.OK],
      [TransferStep.CREDIT_RECEIVER, StepStatus.FAILED],
      [TransferStep.REVERSE_DEBIT, StepStatus.OK],
    ]);
    expect(balance('user-1')).toBe(500);
    expect(balance('user-2')).toBe(100);
  });

  it('lists only transfers involving the given account', async () => {
    await transfers.create({
      fromAccountId: 'user-1',
      toAccountId: 'user-2',
      amount: 1,
    });
    await transfers.create({
      fromAccountId: 'user-2',
      toAccountId: 'user-1',
      amount: 1,
    });
    await accounts.create({ name: 'Eve', currency: 'USD', initialBalance: 5 });

    expect(await transfers.findAll('user-2')).toHaveLength(2);
    expect(await transfers.findAll('user-3')).toHaveLength(0);
  });
});
