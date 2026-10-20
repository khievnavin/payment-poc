"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const payment_entity_1 = require("./entities/payment.entity");
let PaymentService = class PaymentService {
    payments = new Map();
    create(dto) {
        const now = new Date();
        const payment = {
            id: (0, crypto_1.randomUUID)(),
            orderId: dto.orderId,
            amount: dto.amount,
            currency: dto.currency,
            method: dto.method ?? 'card',
            status: payment_entity_1.PaymentStatus.PENDING,
            createdAt: now,
            updatedAt: now,
        };
        this.payments.set(payment.id, payment);
        payment.status = payment_entity_1.PaymentStatus.COMPLETED;
        payment.updatedAt = new Date();
        this.payments.set(payment.id, payment);
        return Promise.resolve(payment);
    }
    findAll() {
        return Promise.resolve(Array.from(this.payments.values()));
    }
    findOne(id) {
        const payment = this.payments.get(id);
        if (!payment) {
            throw new common_1.NotFoundException(`Payment ${id} not found`);
        }
        return Promise.resolve(payment);
    }
    async refund(id, reason) {
        const payment = await this.findOne(id);
        if (payment.status !== payment_entity_1.PaymentStatus.COMPLETED) {
            throw new common_1.BadRequestException(`Payment ${id} cannot be refunded from status ${payment.status}`);
        }
        payment.status = payment_entity_1.PaymentStatus.REFUNDED;
        payment.updatedAt = new Date();
        this.payments.set(id, payment);
        void reason;
        return payment;
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)()
], PaymentService);
//# sourceMappingURL=payment.service.js.map