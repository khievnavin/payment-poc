import { Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreatePaymentDto, PaymentPartyDto } from './create-payment.dto';

/**
 * A payment received outside this service (bank transfer or cash) that an
 * officer confirmed: stored as COMPLETED, nothing is charged.
 */
export class RecordPaymentDto extends CreatePaymentDto {
  /** Required: the empty default fails the check when it is left out. */
  @IsString()
  @IsIn(['bank_transfer', 'cash'])
  override method = '';

  /** Bank transaction or receipt number. */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  reference!: string;

  /** The officer who confirmed it. */
  @ValidateNested()
  @Type(() => PaymentPartyDto)
  confirmedBy!: PaymentPartyDto;
}
