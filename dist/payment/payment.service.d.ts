import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { Payment, PaymentParty } from './entities/payment.entity';
export declare function describePayment(p: Payment): string;
export declare class PaymentService {
    private readonly payments;
    private readonly logger;
    constructor(payments: Repository<Payment>);
    create(dto: CreatePaymentDto): Promise<Payment>;
    record(dto: RecordPaymentDto): Promise<Payment>;
    confirm(id: string, confirmedBy: PaymentParty): Promise<Payment>;
    findAll(): Promise<Payment[]>;
    findByOrder(orderId: string): Promise<Payment[]>;
    private get;
    findOne(id: string): Promise<Payment>;
    refund(id: string, reason?: string): Promise<Payment>;
}
