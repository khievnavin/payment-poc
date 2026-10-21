import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { TRANSFER_PIPELINE, TransferStep } from '../entities/transfer.entity';

export class CreateTransferDto {
  @IsString()
  @IsNotEmpty()
  fromAccountId!: string;

  @IsString()
  @IsNotEmpty()
  toAccountId!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount!: number;

  @IsString()
  @MaxLength(140)
  @IsOptional()
  note?: string;

  // Testing aid: force the pipeline to fail at this step, e.g.
  // CREDIT_RECEIVER to see the debit get reversed.
  @IsIn(TRANSFER_PIPELINE)
  @IsOptional()
  simulateFailureAt?: TransferStep;
}
