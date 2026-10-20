import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment, PaymentStatus } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  // In-memory store for now — swap for a real DB (Postgres/Mongo) repository later.
  private readonly payments = new Map<string, Payment>();

  create(dto: CreatePaymentDto): Promise<Payment> {
    const now = new Date();
    const payment: Payment = {
      id: randomUUID(),
      orderId: dto.orderId,
      amount: dto.amount,
      currency: dto.currency,
      method: dto.method ?? 'card',
      status: PaymentStatus.PENDING,
      createdAt: now,
      updatedAt: now,
    };

    this.payments.set(payment.id, payment);

    // Simulate talking to a payment gateway (Stripe/PayPal/etc).
    // Replace this with a real gateway call; for now it always succeeds.
    payment.status = PaymentStatus.COMPLETED;
    payment.updatedAt = new Date();
    this.payments.set(payment.id, payment);

    return Promise.resolve(payment);
  }

  findAll(): Promise<Payment[]> {
    return Promise.resolve(Array.from(this.payments.values()));
  }

  findOne(id: string): Promise<Payment> {
    const payment = this.payments.get(id);
    if (!payment) {
      throw new NotFoundException(`Payment ${id} not found`);
    }
    return Promise.resolve(payment);
  }

  async refund(id: string, reason?: string): Promise<Payment> {
    const payment = await this.findOne(id);

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException(
        `Payment ${id} cannot be refunded from status ${payment.status}`,
      );
    }

    payment.status = PaymentStatus.REFUNDED;
    payment.updatedAt = new Date();
    this.payments.set(id, payment);

    // reason is accepted for audit/logging purposes; wire up persistence later.
    void reason;

    return payment;
  }
}
