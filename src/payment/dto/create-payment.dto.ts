import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';

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
}
