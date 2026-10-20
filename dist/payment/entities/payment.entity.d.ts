export declare enum PaymentStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}
export declare class Payment {
    id: string;
    orderId: string;
    amount: number;
    currency: string;
    method: string;
    status: PaymentStatus;
    createdAt: Date;
    updatedAt: Date;
}
