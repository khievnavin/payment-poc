import { AccountService } from '../account/account.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { Transfer } from './entities/transfer.entity';
export declare const MAX_TRANSFER_AMOUNT = 10000;
export declare class TransferService {
    private readonly accountService;
    private readonly transfers;
    constructor(accountService: AccountService);
    create(dto: CreateTransferDto): Promise<Transfer>;
    findAll(accountId?: string): Promise<Transfer[]>;
    findOne(id: string): Promise<Transfer>;
    private process;
}
