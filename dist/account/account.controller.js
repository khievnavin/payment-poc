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
exports.AccountController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const account_service_1 = require("./account.service");
const create_account_dto_1 = require("./dto/create-account.dto");
const deposit_dto_1 = require("./dto/deposit.dto");
const update_account_status_dto_1 = require("./dto/update-account-status.dto");
const account_patterns_1 = require("./account.patterns");
let AccountController = class AccountController {
    accountService;
    constructor(accountService) {
        this.accountService = accountService;
    }
    createHttp(dto) {
        return this.accountService.create(dto);
    }
    findAllHttp() {
        return this.accountService.findAll();
    }
    findOneHttp(id) {
        return this.accountService.findOne(id);
    }
    depositHttp(id, dto) {
        return this.accountService.deposit(id, dto.amount);
    }
    updateStatusHttp(id, dto) {
        return this.accountService.updateStatus(id, dto.status);
    }
    create(dto) {
        return this.accountService.create(dto);
    }
    findAll() {
        return this.accountService.findAll();
    }
    findOne(data) {
        return this.accountService.findOne(data.id);
    }
    deposit(data) {
        return this.accountService.deposit(data.id, data.amount);
    }
    updateStatus(data) {
        return this.accountService.updateStatus(data.id, data.status);
    }
};
exports.AccountController = AccountController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_account_dto_1.CreateAccountDto]),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "createHttp", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "findAllHttp", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "findOneHttp", null);
__decorate([
    (0, common_1.Post)(':id/deposit'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, deposit_dto_1.DepositDto]),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "depositHttp", null);
__decorate([
    (0, common_1.Post)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_account_status_dto_1.UpdateAccountStatusDto]),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "updateStatusHttp", null);
__decorate([
    (0, microservices_1.MessagePattern)(account_patterns_1.AccountPatterns.CREATE),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_account_dto_1.CreateAccountDto]),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "create", null);
__decorate([
    (0, microservices_1.MessagePattern)(account_patterns_1.AccountPatterns.FIND_ALL),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "findAll", null);
__decorate([
    (0, microservices_1.MessagePattern)(account_patterns_1.AccountPatterns.FIND_ONE),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "findOne", null);
__decorate([
    (0, microservices_1.MessagePattern)(account_patterns_1.AccountPatterns.DEPOSIT),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "deposit", null);
__decorate([
    (0, microservices_1.MessagePattern)(account_patterns_1.AccountPatterns.UPDATE_STATUS),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "updateStatus", null);
exports.AccountController = AccountController = __decorate([
    (0, common_1.Controller)('accounts'),
    __metadata("design:paramtypes", [account_service_1.AccountService])
], AccountController);
//# sourceMappingURL=account.controller.js.map