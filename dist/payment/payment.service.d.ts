import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';
export declare class PaymentService {
    private readonly payments;
    create(dto: CreatePaymentDto): Promise<Payment>;
    findAll(): Promise<Payment[]>;
    findOne(id: string): Promise<Payment>;
    refund(id: string, reason?: string): Promise<Payment>;
}
