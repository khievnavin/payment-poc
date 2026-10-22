import { Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

/** Who pays or who receives (see PaymentParty). */
export class PaymentPartyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  id!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  department?: string;
}

export class CreatePaymentDto {
  @IsString()
  orderId!: string;

  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsString()
  @IsIn(['USD', 'EUR', 'KHR'])
  currency!: string;

  @IsString()
  @IsOptional()
  method?: string;

  /** Who pays (e.g. the citizen). */
  @ValidateNested()
  @Type(() => PaymentPartyDto)
  @IsOptional()
  payer?: PaymentPartyDto;

  /** Who receives the money (e.g. the province office). */
  @ValidateNested()
  @Type(() => PaymentPartyDto)
  @IsOptional()
  payee?: PaymentPartyDto;

  /** What it is for (e.g. the service applied for). */
  @IsString()
  @IsOptional()
  @MaxLength(200)
  description?: string;

  /** Transaction reference; the service makes a UUID when it is left out. */
  @IsString()
  @IsOptional()
  @MaxLength(100)
  reference?: string;

  /** The receiving bank, e.g. the office's bank from its website (ACLEDA, ABA…). */
  @IsString()
  @IsOptional()
  @MaxLength(100)
  bankName?: string;
}
