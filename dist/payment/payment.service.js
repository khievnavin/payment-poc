"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PaymentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
exports.describePayment = describePayment;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const crypto_1 = require("crypto");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("./entities/payment.entity");
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUuid = (id) => UUID.test(id);
function party(x) {
    return x
        ? `${x.name} (${x.id})${x.department ? ` · ${x.department}` : ''}`
        : '—';
}
function describePayment(p) {
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
let PaymentService = PaymentService_1 = class PaymentService {
    payments;
    logger = new common_1.Logger(PaymentService_1.name);
    constructor(payments) {
        this.payments = payments;
    }
    async create(dto) {
        const now = new Date();
        const payment = {
            id: (0, crypto_1.randomUUID)(),
            orderId: dto.orderId,
            amount: dto.amount,
            currency: dto.currency,
            method: dto.method ?? 'card',
            status: payment_entity_1.PaymentStatus.PENDING,
            confirmationStatus: payment_entity_1.ConfirmationStatus.WAITING_CONFIRMATION,
            confirmedBy: null,
            confirmedAt: null,
            payer: dto.payer,
            payee: dto.payee,
            description: dto.description,
            bankName: dto.bankName ?? null,
            reference: dto.reference ?? (0, crypto_1.randomUUID)(),
            createdAt: now,
            updatedAt: now,
        };
        payment.status = payment_entity_1.PaymentStatus.COMPLETED;
        const saved = await this.payments.save(payment);
        this.logger.log(`Created\n${describePayment(saved)}`);
        return saved;
    }
    async record(dto) {
        const now = new Date();
        const payment = {
            id: (0, crypto_1.randomUUID)(),
            orderId: dto.orderId,
            amount: dto.amount,
            currency: dto.currency,
            method: dto.method,
            status: payment_entity_1.PaymentStatus.COMPLETED,
            payer: dto.payer,
            payee: dto.payee,
            description: dto.description,
            bankName: dto.bankName ?? null,
            reference: dto.reference,
            confirmationStatus: payment_entity_1.ConfirmationStatus.CONFIRMED,
            confirmedBy: dto.confirmedBy,
            confirmedAt: now,
            createdAt: now,
            updatedAt: now,
        };
        const saved = await this.payments.save(payment);
        this.logger.log(`Recorded\n${describePayment(saved)}`);
        return saved;
    }
    async confirm(id, confirmedBy) {
        const payment = await this.get(id);
        if (payment.status !== payment_entity_1.PaymentStatus.COMPLETED) {
            throw new common_1.BadRequestException(`Payment ${id} cannot be confirmed from status ${payment.status}`);
        }
        payment.confirmationStatus = payment_entity_1.ConfirmationStatus.CONFIRMED;
        payment.confirmedBy = confirmedBy;
        payment.confirmedAt = new Date();
        const saved = await this.payments.save(payment);
        this.logger.log(`Confirmed\n${describePayment(saved)}`);
        return saved;
    }
    findAll() {
        return this.payments.find({ order: { createdAt: 'DESC' } });
    }
    async findByOrder(orderId) {
        const found = await this.payments.find({
            where: { orderId },
            order: { createdAt: 'DESC' },
        });
        this.logger.log(`Looked up order ${orderId}: ${found.length} payment(s)${found.map((p) => `\n${describePayment(p)}`).join('')}`);
        return found;
    }
    async get(id) {
        const payment = isUuid(id) ? await this.payments.findOneBy({ id }) : null;
        if (!payment) {
            throw new common_1.NotFoundException(`Payment ${id} not found`);
        }
        return payment;
    }
    async findOne(id) {
        try {
            const payment = await this.get(id);
            this.logger.log(`Looked up\n${describePayment(payment)}`);
            return payment;
        }
        catch (e) {
            this.logger.warn(`Looked up ${id}: not found`);
            throw e;
        }
    }
    async refund(id, reason) {
        const payment = await this.get(id);
        if (payment.status !== payment_entity_1.PaymentStatus.COMPLETED) {
            throw new common_1.BadRequestException(`Payment ${id} cannot be refunded from status ${payment.status}`);
        }
        payment.status = payment_entity_1.PaymentStatus.REFUNDED;
        const saved = await this.payments.save(payment);
        this.logger.log(`Refunded${reason ? ` (${reason})` : ''}\n${describePayment(saved)}`);
        return saved;
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = PaymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PaymentService);
//# sourceMappingURL=payment.service.js.map