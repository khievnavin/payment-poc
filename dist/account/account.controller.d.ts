import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { DepositDto } from './dto/deposit.dto';
import { UpdateAccountStatusDto } from './dto/update-account-status.dto';
import { AccountStatus } from './entities/account.entity';
export declare class AccountController {
    private readonly accountService;
    constructor(accountService: AccountService);
    createHttp(dto: CreateAccountDto): Promise<import("./entities/account.entity").Account>;
    findAllHttp(): Promise<import("./entities/account.entity").Account[]>;
    findOneHttp(id: string): Promise<import("./entities/account.entity").Account>;
    depositHttp(id: string, dto: DepositDto): Promise<import("./entities/account.entity").Account>;
    updateStatusHttp(id: string, dto: UpdateAccountStatusDto): Promise<import("./entities/account.entity").Account>;
    create(dto: CreateAccountDto): Promise<import("./entities/account.entity").Account>;
    findAll(): Promise<import("./entities/account.entity").Account[]>;
    findOne(data: {
        id: string;
    }): Promise<import("./entities/account.entity").Account>;
    deposit(data: {
        id: string;
        amount: number;
    }): Promise<import("./entities/account.entity").Account>;
    updateStatus(data: {
        id: string;
        status: AccountStatus;
    }): Promise<import("./entities/account.entity").Account>;
}
