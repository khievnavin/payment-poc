import { TransferStep } from '../entities/transfer.entity';
export declare class CreateTransferDto {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    note?: string;
    simulateFailureAt?: TransferStep;
}
