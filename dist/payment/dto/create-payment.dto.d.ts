export declare class PaymentPartyDto {
    id: string;
    name: string;
    department?: string;
}
export declare class CreatePaymentDto {
    orderId: string;
    amount: number;
    currency: string;
    method?: string;
    payer?: PaymentPartyDto;
    payee?: PaymentPartyDto;
    description?: string;
    reference?: string;
    bankName?: string;
}
