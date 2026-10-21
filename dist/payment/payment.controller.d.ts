import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { PaymentPartyDto } from './dto/create-payment.dto';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createHttp(dto: CreatePaymentDto): Promise<import("./entities/payment.entity").Payment>;
    recordHttp(dto: RecordPaymentDto): Promise<import("./entities/payment.entity").Payment>;
    findAllHttp(): Promise<import("./entities/payment.entity").Payment[]>;
    findByOrderHttp(orderId: string): Promise<import("./entities/payment.entity").Payment[]>;
    findOneHttp(id: string): Promise<import("./entities/payment.entity").Payment>;
    confirmHttp(id: string, dto: PaymentPartyDto): Promise<import("./entities/payment.entity").Payment>;
    refundHttp(id: string, dto: RefundPaymentDto): Promise<import("./entities/payment.entity").Payment>;
    create(dto: CreatePaymentDto): Promise<import("./entities/payment.entity").Payment>;
    record(dto: RecordPaymentDto): Promise<import("./entities/payment.entity").Payment>;
    confirm(dto: ConfirmPaymentDto): Promise<import("./entities/payment.entity").Payment>;
    findAll(): Promise<import("./entities/payment.entity").Payment[]>;
    findOne(data: {
        id: string;
    }): Promise<import("./entities/payment.entity").Payment>;
    findByOrder(data: {
        orderId: string;
    }): Promise<import("./entities/payment.entity").Payment[]>;
    refund(data: {
        id: string;
        reason?: string;
    }): Promise<import("./entities/payment.entity").Payment>;
}
