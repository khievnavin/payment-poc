export declare enum PaymentStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}
export declare enum ConfirmationStatus {
    WAITING_CONFIRMATION = "WAITING_CONFIRMATION",
    CONFIRMED = "CONFIRMED"
}
export interface PaymentParty {
    id: string;
    name: string;
    department?: string;
}
export declare class Payment {
    id: string;
    orderId: string;
    amount: number;
    currency: string;
    method: string;
    status: PaymentStatus;
    payer?: PaymentParty;
    payee?: PaymentParty;
    description?: string;
    bankName?: string | null;
    reference?: string;
    confirmationStatus: ConfirmationStatus;
    confirmedBy?: PaymentParty | null;
    confirmedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
