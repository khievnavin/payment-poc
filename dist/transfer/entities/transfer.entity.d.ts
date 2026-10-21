export declare enum TransferStatus {
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    REVERSED = "REVERSED"
}
export declare enum TransferStep {
    VALIDATE = "VALIDATE",
    CHECK_SENDER = "CHECK_SENDER",
    CHECK_RECEIVER = "CHECK_RECEIVER",
    CHECK_LIMIT = "CHECK_LIMIT",
    CHECK_FUNDS = "CHECK_FUNDS",
    DEBIT_SENDER = "DEBIT_SENDER",
    CREDIT_RECEIVER = "CREDIT_RECEIVER",
    REVERSE_DEBIT = "REVERSE_DEBIT"
}
export declare const TRANSFER_PIPELINE: TransferStep[];
export declare enum StepStatus {
    OK = "OK",
    FAILED = "FAILED",
    SKIPPED = "SKIPPED"
}
export interface TransferStepResult {
    step: TransferStep;
    status: StepStatus;
    message: string;
    at: Date;
}
export interface TransferFailure {
    step: TransferStep;
    code: string;
    message: string;
}
export declare class Transfer {
    id: string;
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    currency?: string;
    note?: string;
    status: TransferStatus;
    receiverCredited: boolean;
    failure?: TransferFailure;
    steps: TransferStepResult[];
    createdAt: Date;
    updatedAt: Date;
}
