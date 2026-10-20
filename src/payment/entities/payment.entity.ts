export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export class Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  method: string;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}
