import { CreateAccountDto } from './dto/create-account.dto';
import { Account, AccountStatus } from './entities/account.entity';
export declare class AccountService {
    private readonly accounts;
    constructor();
    private seed;
    create(dto: CreateAccountDto): Promise<Account>;
    findAll(): Promise<Account[]>;
    findOne(id: string): Promise<Account>;
    get(id: string): Account | undefined;
    deposit(id: string, amount: number): Promise<Account>;
    updateStatus(id: string, status: AccountStatus): Promise<Account>;
    debit(account: Account, amount: number): void;
    credit(account: Account, amount: number): void;
}
