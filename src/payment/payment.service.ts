import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';
import {
  ConfirmationStatus,
  Payment,
  PaymentParty,
  PaymentStatus,
} from './entities/payment.entity';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUuid = (id: string) => UUID.test(id);

/** "Name (id) · department", or a dash. */
function party(x?: PaymentParty): string {
  return x
    ? `${x.name} (${x.id})${x.department ? ` · ${x.department}` : ''}`
    : '—';
}

/** A payment's details over a few lines, for the console. */
export function describePayment(p: Payment): string {
  return [
    `${p.orderId} · ${Number(p.amount).toFixed(2)} ${p.currency} · ${p.method} · ${p.status} · id ${p.id}`,
    `  sender:       ${party(p.payer)}`,
    `  receiver:     ${party(p.payee)}`,
    ...(p.description ? [`  description:  ${p.description}`] : []),
    ...(p.bankName ? [`  bank:         ${p.bankName}`] : []),
    ...(p.reference ? [`  reference:    ${p.reference}`] : []),
    p.confirmedBy
      ? `  confirmed by: ${party(p.confirmedBy)}${p.confirmedAt ? ` at ${new Date(p.confirmedAt).toISOString()}` : ''}`
      : `  confirmed by: waiting for confirmation`,
  ].join('\n');
}

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(Payment) private readonly payments: Repository<Payment>,
  ) {}

  async create(dto: CreatePaymentDto): Promise<Payment> {
    const now = new Date();
    const payment: Payment = {
      id: randomUUID(),
      orderId: dto.orderId,
      amount: dto.amount,
      currency: dto.currency,
      method: dto.method ?? 'card',
      status: PaymentStatus.PENDING,
      confirmationStatus: ConfirmationStatus.WAITING_CONFIRMATION,
      confirmedBy: null,
      confirmedAt: null,
      payer: dto.payer,
      payee: dto.payee,
      description: dto.description,
      bankName: dto.bankName ?? null,
      reference: dto.reference ?? randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    // Simulate talking to a payment gateway (Stripe/PayPal/etc).
    // Replace this with a real gateway call; for now it always succeeds.
    // Charged; an officer still has to confirm it (WAITING_CONFIRMATION).
    payment.status = PaymentStatus.COMPLETED;
    const saved = await this.payments.save(payment);
    this.logger.log(`Created\n${describePayment(saved)}`);

    return saved;
  }

  /** Stores a payment received by bank transfer or cash, as confirmed by an officer. */
  async record(dto: RecordPaymentDto): Promise<Payment> {
    const now = new Date();
    const payment: Payment = {
      id: randomUUID(),
      orderId: dto.orderId,
      amount: dto.amount,
      currency: dto.currency,
      method: dto.method,
      status: PaymentStatus.COMPLETED,
      payer: dto.payer,
      payee: dto.payee,
      description: dto.description,
      bankName: dto.bankName ?? null,
      reference: dto.reference,
      confirmationStatus: ConfirmationStatus.CONFIRMED,
      confirmedBy: dto.confirmedBy,
      confirmedAt: now,
      createdAt: now,
      updatedAt: now,
    };
    const saved = await this.payments.save(payment);
    this.logger.log(`Recorded\n${describePayment(saved)}`);
    return saved;
  }

  /** Notes the officer who confirmed a payment: no longer waiting for confirmation. */
  async confirm(id: string, confirmedBy: PaymentParty): Promise<Payment> {
    const payment = await this.get(id);
    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException(
        `Payment ${id} cannot be confirmed from status ${payment.status}`,
      );
    }
    payment.confirmationStatus = ConfirmationStatus.CONFIRMED;
    payment.confirmedBy = confirmedBy;
    payment.confirmedAt = new Date();
    const saved = await this.payments.save(payment);
    this.logger.log(`Confirmed\n${describePayment(saved)}`);
    return saved;
  }

  findAll(): Promise<Payment[]> {
    return this.payments.find({ order: { createdAt: 'DESC' } });
  }

  /** Every payment of an order (e.g. an application number), newest first. */
  async findByOrder(orderId: string): Promise<Payment[]> {
    const found = await this.payments.find({
      where: { orderId },
      order: { createdAt: 'DESC' },
    });
    this.logger.log(
      `Looked up order ${orderId}: ${found.length} payment(s)${found.map((p) => `\n${describePayment(p)}`).join('')}`,
    );
    return found;
  }

  /** A payment by id, without logging the look-up (for confirm / refund). Not a UUID: not found. */
  private async get(id: string): Promise<Payment> {
    const payment = isUuid(id) ? await this.payments.findOneBy({ id }) : null;
    if (!payment) {
      throw new NotFoundException(`Payment ${id} not found`);
    }
    return payment;
  }

  async findOne(id: string): Promise<Payment> {
    try {
      const payment = await this.get(id);
      this.logger.log(`Looked up\n${describePayment(payment)}`);
      return payment;
    } catch (e) {
      this.logger.warn(`Looked up ${id}: not found`);
      throw e;
    }
  }

  async refund(id: string, reason?: string): Promise<Payment> {
    const payment = await this.get(id);

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException(
        `Payment ${id} cannot be refunded from status ${payment.status}`,
      );
    }

    payment.status = PaymentStatus.REFUNDED;
    const saved = await this.payments.save(payment);
    this.logger.log(
      `Refunded${reason ? ` (${reason})` : ''}\n${describePayment(saved)}`,
    );

    return saved;
  }
}
