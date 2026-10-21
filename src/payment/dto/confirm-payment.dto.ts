import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { PaymentPartyDto } from './create-payment.dto';

/** The officer who confirmed a payment this service charged. */
export class ConfirmPaymentDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ValidateNested()
  @Type(() => PaymentPartyDto)
  confirmedBy!: PaymentPartyDto;
}
