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
exports.TransferController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const transfer_service_1 = require("./transfer.service");
const create_transfer_dto_1 = require("./dto/create-transfer.dto");
const transfer_patterns_1 = require("./transfer.patterns");
let TransferController = class TransferController {
    transferService;
    constructor(transferService) {
        this.transferService = transferService;
    }
    createHttp(dto) {
        return this.transferService.create(dto);
    }
    findAllHttp(accountId) {
        return this.transferService.findAll(accountId);
    }
    findOneHttp(id) {
        return this.transferService.findOne(id);
    }
    create(dto) {
        return this.transferService.create(dto);
    }
    findAll(data) {
        return this.transferService.findAll(data?.accountId);
    }
    findOne(data) {
        return this.transferService.findOne(data.id);
    }
};
exports.TransferController = TransferController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_transfer_dto_1.CreateTransferDto]),
    __metadata("design:returntype", void 0)
], TransferController.prototype, "createHttp", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('accountId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TransferController.prototype, "findAllHttp", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TransferController.prototype, "findOneHttp", null);
__decorate([
    (0, microservices_1.MessagePattern)(transfer_patterns_1.TransferPatterns.CREATE),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_transfer_dto_1.CreateTransferDto]),
    __metadata("design:returntype", void 0)
], TransferController.prototype, "create", null);
__decorate([
    (0, microservices_1.MessagePattern)(transfer_patterns_1.TransferPatterns.FIND_ALL),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TransferController.prototype, "findAll", null);
__decorate([
    (0, microservices_1.MessagePattern)(transfer_patterns_1.TransferPatterns.FIND_ONE),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TransferController.prototype, "findOne", null);
exports.TransferController = TransferController = __decorate([
    (0, common_1.Controller)('transfers'),
    __metadata("design:paramtypes", [transfer_service_1.TransferService])
], TransferController);
//# sourceMappingURL=transfer.controller.js.map