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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const account_entity_1 = require("./entities/account.entity");
const round2 = (n) => Math.round(n * 100) / 100;
let AccountService = class AccountService {
    accounts = new Map();
    constructor() {
        this.seed('user-1', 'Alice', 'USD', 500, account_entity_1.AccountStatus.ACTIVE);
        this.seed('user-2', 'Bob', 'USD', 100, account_entity_1.AccountStatus.ACTIVE);
        this.seed('user-3', 'Chan', 'KHR', 400000, account_entity_1.AccountStatus.ACTIVE);
        this.seed('user-4', 'Dara (frozen)', 'USD', 50, account_entity_1.AccountStatus.FROZEN);
    }
    seed(id, name, currency, balance, status) {
        const now = new Date();
        this.accounts.set(id, {
            id,
            name,
            currency,
            balance,
            status,
            createdAt: now,
            updatedAt: now,
        });
    }
    create(dto) {
        const now = new Date();
        const account = {
            id: (0, crypto_1.randomUUID)(),
            name: dto.name,
            currency: dto.currency,
            balance: round2(dto.initialBalance ?? 0),
            status: account_entity_1.AccountStatus.ACTIVE,
            createdAt: now,
            updatedAt: now,
        };
        this.accounts.set(account.id, account);
        return Promise.resolve(account);
    }
    findAll() {
        return Promise.resolve(Array.from(this.accounts.values()));
    }
    findOne(id) {
        const account = this.accounts.get(id);
        if (!account) {
            throw new common_1.NotFoundException(`Account ${id} not found`);
        }
        return Promise.resolve(account);
    }
    get(id) {
        return this.accounts.get(id);
    }
    async deposit(id, amount) {
        const account = await this.findOne(id);
        this.credit(account, amount);
        return account;
    }
    async updateStatus(id, status) {
        const account = await this.findOne(id);
        account.status = status;
        account.updatedAt = new Date();
        return account;
    }
    debit(account, amount) {
        account.balance = round2(account.balance - amount);
        account.updatedAt = new Date();
    }
    credit(account, amount) {
        account.balance = round2(account.balance + amount);
        account.updatedAt = new Date();
    }
};
exports.AccountService = AccountService;
exports.AccountService = AccountService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AccountService);
//# sourceMappingURL=account.service.js.map