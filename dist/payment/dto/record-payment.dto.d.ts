import { CreatePaymentDto, PaymentPartyDto } from './create-payment.dto';
export declare class RecordPaymentDto extends CreatePaymentDto {
    method: string;
    reference: string;
    confirmedBy: PaymentPartyDto;
}
