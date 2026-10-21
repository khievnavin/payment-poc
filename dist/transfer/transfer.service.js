"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferService = exports.MAX_TRANSFER_AMOUNT = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const account_service_1 = require("../account/account.service");
const account_entity_1 = require("../account/entities/account.entity");
const transfer_entity_1 = require("./entities/transfer.entity");
exports.MAX_TRANSFER_AMOUNT = 10_000;
class StepFailure extends Error {
    step;
    code;
    constructor(step, code, message) {
        super(message);
        this.step = step;
        this.code = code;
    }
}
let TransferService = class TransferService {
    accountService;
    transfers = new Map();
    constructor(accountService) {
        this.accountService = accountService;
    }
    create(dto) {
        const now = new Date();
        const transfer = {
            id: (0, crypto_1.randomUUID)(),
            fromAccountId: dto.fromAccountId,
            toAccountId: dto.toAccountId,
            amount: dto.amount,
            note: dto.note,
            status: transfer_entity_1.TransferStatus.PROCESSING,
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
    findAll(accountId) {
        const all = Array.from(this.transfers.values());
        return Promise.resolve(accountId
            ? all.filter((t) => t.fromAccountId === accountId || t.toAccountId === accountId)
            : all);
    }
    findOne(id) {
        const transfer = this.transfers.get(id);
        if (!transfer) {
            throw new common_1.NotFoundException(`Transfer ${id} not found`);
        }
        return Promise.resolve(transfer);
    }
    process(transfer, simulateFailureAt) {
        let sender;
        let receiver;
        let debited = false;
        const run = (step, fn) => {
            if (simulateFailureAt === step) {
                throw new StepFailure(step, 'SIMULATED_FAILURE', `Simulated failure at ${step}`);
            }
            const message = fn();
            transfer.steps.push({
                step,
                status: transfer_entity_1.StepStatus.OK,
                message,
                at: new Date(),
            });
        };
        try {
            run(transfer_entity_1.TransferStep.VALIDATE, () => {
                if (transfer.fromAccountId === transfer.toAccountId) {
                    throw new StepFailure(transfer_entity_1.TransferStep.VALIDATE, 'SAME_ACCOUNT', 'Sender and receiver must be different accounts');
                }
                return 'Request is valid';
            });
            run(transfer_entity_1.TransferStep.CHECK_SENDER, () => {
                sender = this.accountService.get(transfer.fromAccountId);
                if (!sender) {
                    throw new StepFailure(transfer_entity_1.TransferStep.CHECK_SENDER, 'SENDER_NOT_FOUND', `Sender account ${transfer.fromAccountId} does not exist`);
                }
                transfer.currency = sender.currency;
                if (sender.status !== account_entity_1.AccountStatus.ACTIVE) {
                    throw new StepFailure(transfer_entity_1.TransferStep.CHECK_SENDER, 'SENDER_ACCOUNT_FROZEN', `Sender account ${sender.name} is ${sender.status}`);
                }
                return `Sender ${sender.name} is active`;
            });
            run(transfer_entity_1.TransferStep.CHECK_RECEIVER, () => {
                receiver = this.accountService.get(transfer.toAccountId);
                if (!receiver) {
                    throw new StepFailure(transfer_entity_1.TransferStep.CHECK_RECEIVER, 'RECEIVER_NOT_FOUND', `Receiver account ${transfer.toAccountId} does not exist`);
                }
                if (receiver.status !== account_entity_1.AccountStatus.ACTIVE) {
                    throw new StepFailure(transfer_entity_1.TransferStep.CHECK_RECEIVER, 'RECEIVER_ACCOUNT_FROZEN', `Receiver account ${receiver.name} is ${receiver.status}`);
                }
                if (receiver.currency !== sender.currency) {
                    throw new StepFailure(transfer_entity_1.TransferStep.CHECK_RECEIVER, 'CURRENCY_MISMATCH', `Receiver holds ${receiver.currency}, sender holds ${sender.currency}`);
                }
                return `Receiver ${receiver.name} is active and accepts ${receiver.currency}`;
            });
            run(transfer_entity_1.TransferStep.CHECK_LIMIT, () => {
                if (transfer.amount > exports.MAX_TRANSFER_AMOUNT) {
                    throw new StepFailure(transfer_entity_1.TransferStep.CHECK_LIMIT, 'LIMIT_EXCEEDED', `Amount ${transfer.amount} exceeds the per-transfer limit of ${exports.MAX_TRANSFER_AMOUNT}`);
                }
                return `Within the ${exports.MAX_TRANSFER_AMOUNT} per-transfer limit`;
            });
            run(transfer_entity_1.TransferStep.CHECK_FUNDS, () => {
                if (sender.balance < transfer.amount) {
                    throw new StepFailure(transfer_entity_1.TransferStep.CHECK_FUNDS, 'INSUFFICIENT_FUNDS', `Sender balance ${sender.balance} is less than ${transfer.amount}`);
                }
                return `Sender has ${sender.balance} available`;
            });
            run(transfer_entity_1.TransferStep.DEBIT_SENDER, () => {
                this.accountService.debit(sender, transfer.amount);
                debited = true;
                return `Debited ${transfer.amount} from ${sender.name}`;
            });
            run(transfer_entity_1.TransferStep.CREDIT_RECEIVER, () => {
                this.accountService.credit(receiver, transfer.amount);
                transfer.receiverCredited = true;
                return `Credited ${transfer.amount} to ${receiver.name}`;
            });
            transfer.status = transfer_entity_1.TransferStatus.COMPLETED;
        }
        catch (err) {
            const failure = err instanceof StepFailure
                ? err
                : new StepFailure(transfer_entity_1.TRANSFER_PIPELINE[transfer.steps.length], 'INTERNAL_ERROR', err instanceof Error ? err.message : String(err));
            transfer.failure = {
                step: failure.step,
                code: failure.code,
                message: failure.message,
            };
            transfer.steps.push({
                step: failure.step,
                status: transfer_entity_1.StepStatus.FAILED,
                message: failure.message,
                at: new Date(),
            });
            const failedIndex = transfer_entity_1.TRANSFER_PIPELINE.indexOf(failure.step);
            for (const step of transfer_entity_1.TRANSFER_PIPELINE.slice(failedIndex + 1)) {
                transfer.steps.push({
                    step,
                    status: transfer_entity_1.StepStatus.SKIPPED,
                    message: `Not run: stopped at ${failure.step}`,
                    at: new Date(),
                });
            }
            if (debited) {
                this.accountService.credit(sender, transfer.amount);
                transfer.steps.push({
                    step: transfer_entity_1.TransferStep.REVERSE_DEBIT,
                    status: transfer_entity_1.StepStatus.OK,
                    message: `Returned ${transfer.amount} to ${sender.name}`,
                    at: new Date(),
                });
                transfer.status = transfer_entity_1.TransferStatus.REVERSED;
            }
            else {
                transfer.status = transfer_entity_1.TransferStatus.FAILED;
            }
        }
    }
};
exports.TransferService = TransferService;
exports.TransferService = TransferService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [account_service_1.AccountService])
], TransferService);
//# sourceMappingURL=transfer.service.js.map