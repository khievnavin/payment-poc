export enum TransferStatus {
  // Pipeline is running.
  PROCESSING = 'PROCESSING',
  // Receiver was credited.
  COMPLETED = 'COMPLETED',
  // Rejected before any money moved; sender was never charged.
  FAILED = 'FAILED',
  // Sender was debited but crediting the receiver failed, so the debit was
  // returned to the sender.
  REVERSED = 'REVERSED',
}

// Steps run in this order. A failure stops the pipeline; later steps are
// recorded as SKIPPED so every client sees exactly where it stopped.
export enum TransferStep {
  VALIDATE = 'VALIDATE',
  CHECK_SENDER = 'CHECK_SENDER',
  CHECK_RECEIVER = 'CHECK_RECEIVER',
  CHECK_LIMIT = 'CHECK_LIMIT',
  CHECK_FUNDS = 'CHECK_FUNDS',
  DEBIT_SENDER = 'DEBIT_SENDER',
  CREDIT_RECEIVER = 'CREDIT_RECEIVER',
  // Compensating step, only recorded after a post-debit failure.
  REVERSE_DEBIT = 'REVERSE_DEBIT',
}

export const TRANSFER_PIPELINE: TransferStep[] = [
  TransferStep.VALIDATE,
  TransferStep.CHECK_SENDER,
  TransferStep.CHECK_RECEIVER,
  TransferStep.CHECK_LIMIT,
  TransferStep.CHECK_FUNDS,
  TransferStep.DEBIT_SENDER,
  TransferStep.CREDIT_RECEIVER,
];

export enum StepStatus {
  OK = 'OK',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED',
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

export class Transfer {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  currency?: string;
  note?: string;
  status: TransferStatus;
  // True only once the receiver's balance has been credited.
  receiverCredited: boolean;
  failure?: TransferFailure;
  steps: TransferStepResult[];
  createdAt: Date;
  updatedAt: Date;
}
