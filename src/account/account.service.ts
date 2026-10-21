import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account, AccountStatus } from './entities/account.entity';

// Balances are plain numbers in the in-memory store; round every result to
// 2 decimals so repeated debits/credits don't accumulate float drift.
const round2 = (n: number) => Math.round(n * 100) / 100;

@Injectable()
export class AccountService {
  // In-memory store for now — swap for a real DB repository later.
  private readonly accounts = new Map<string, Account>();

  constructor() {
    // Demo users so the transfer flow can be tried right away.
    this.seed('user-1', 'Alice', 'USD', 500, AccountStatus.ACTIVE);
    this.seed('user-2', 'Bob', 'USD', 100, AccountStatus.ACTIVE);
    this.seed('user-3', 'Chan', 'KHR', 400000, AccountStatus.ACTIVE);
    this.seed('user-4', 'Dara (frozen)', 'USD', 50, AccountStatus.FROZEN);
  }

  private seed(
    id: string,
    name: string,
    currency: string,
    balance: number,
    status: AccountStatus,
  ) {
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

  create(dto: CreateAccountDto): Promise<Account> {
    const now = new Date();
    const account: Account = {
      id: randomUUID(),
      name: dto.name,
      currency: dto.currency,
      balance: round2(dto.initialBalance ?? 0),
      status: AccountStatus.ACTIVE,
      createdAt: now,
      updatedAt: now,
    };
    this.accounts.set(account.id, account);
    return Promise.resolve(account);
  }

  findAll(): Promise<Account[]> {
    return Promise.resolve(Array.from(this.accounts.values()));
  }

  findOne(id: string): Promise<Account> {
    const account = this.accounts.get(id);
    if (!account) {
      throw new NotFoundException(`Account ${id} not found`);
    }
    return Promise.resolve(account);
  }

  // Non-throwing lookup for the transfer pipeline, which records a missing
  // account as a failed step instead of an HTTP error.
  get(id: string): Account | undefined {
    return this.accounts.get(id);
  }

  async deposit(id: string, amount: number): Promise<Account> {
    const account = await this.findOne(id);
    this.credit(account, amount);
    return account;
  }

  async updateStatus(id: string, status: AccountStatus): Promise<Account> {
    const account = await this.findOne(id);
    account.status = status;
    account.updatedAt = new Date();
    return account;
  }

  debit(account: Account, amount: number): void {
    account.balance = round2(account.balance - amount);
    account.updatedAt = new Date();
  }

  credit(account: Account, amount: number): void {
    account.balance = round2(account.balance + amount);
    account.updatedAt = new Date();
  }
}
