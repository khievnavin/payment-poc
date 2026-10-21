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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const payment_service_1 = require("./payment.service");
const create_payment_dto_1 = require("./dto/create-payment.dto");
const refund_payment_dto_1 = require("./dto/refund-payment.dto");
const record_payment_dto_1 = require("./dto/record-payment.dto");
const confirm_payment_dto_1 = require("./dto/confirm-payment.dto");
const create_payment_dto_2 = require("./dto/create-payment.dto");
const payment_patterns_1 = require("./payment.patterns");
let PaymentController = class PaymentController {
    paymentService;
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    createHttp(dto) {
        return this.paymentService.create(dto);
    }
    recordHttp(dto) {
        return this.paymentService.record(dto);
    }
    findAllHttp() {
        return this.paymentService.findAll();
    }
    findByOrderHttp(orderId) {
        return this.paymentService.findByOrder(orderId);
    }
    findOneHttp(id) {
        return this.paymentService.findOne(id);
    }
    confirmHttp(id, dto) {
        return this.paymentService.confirm(id, dto);
    }
    refundHttp(id, dto) {
        return this.paymentService.refund(id, dto.reason);
    }
    create(dto) {
        return this.paymentService.create(dto);
    }
    record(dto) {
        return this.paymentService.record(dto);
    }
    confirm(dto) {
        return this.paymentService.confirm(dto.id, dto.confirmedBy);
    }
    findAll() {
        return this.paymentService.findAll();
    }
    findOne(data) {
        return this.paymentService.findOne(data.id);
    }
    findByOrder(data) {
        return this.paymentService.findByOrder(data.orderId);
    }
    refund(data) {
        return this.paymentService.refund(data.id, data.reason);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_1.CreatePaymentDto]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "createHttp", null);
__decorate([
    (0, common_1.Post)('record'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [record_payment_dto_1.RecordPaymentDto]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "recordHttp", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "findAllHttp", null);
__decorate([
    (0, common_1.Get)('order/:orderId'),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "findByOrderHttp", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "findOneHttp", null);
__decorate([
    (0, common_1.Post)(':id/confirm'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_payment_dto_2.PaymentPartyDto]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "confirmHttp", null);
__decorate([
    (0, common_1.Post)(':id/refund'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, refund_payment_dto_1.RefundPaymentDto]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "refundHttp", null);
__decorate([
    (0, microservices_1.MessagePattern)(payment_patterns_1.PaymentPatterns.CREATE),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_1.CreatePaymentDto]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "create", null);
__decorate([
    (0, microservices_1.MessagePattern)(payment_patterns_1.PaymentPatterns.RECORD),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [record_payment_dto_1.RecordPaymentDto]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "record", null);
__decorate([
    (0, microservices_1.MessagePattern)(payment_patterns_1.PaymentPatterns.CONFIRM),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [confirm_payment_dto_1.ConfirmPaymentDto]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "confirm", null);
__decorate([
    (0, microservices_1.MessagePattern)(payment_patterns_1.PaymentPatterns.FIND_ALL),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "findAll", null);
__decorate([
    (0, microservices_1.MessagePattern)(payment_patterns_1.PaymentPatterns.FIND_ONE),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "findOne", null);
__decorate([
    (0, microservices_1.MessagePattern)(payment_patterns_1.PaymentPatterns.FIND_BY_ORDER),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "findByOrder", null);
__decorate([
    (0, microservices_1.MessagePattern)(payment_patterns_1.PaymentPatterns.REFUND),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "refund", null);
exports.PaymentController = PaymentController = __decorate([
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map