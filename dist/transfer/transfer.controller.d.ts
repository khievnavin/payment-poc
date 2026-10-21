import { TransferService } from './transfer.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
export declare class TransferController {
    private readonly transferService;
    constructor(transferService: TransferService);
    createHttp(dto: CreateTransferDto): Promise<import("./entities/transfer.entity").Transfer>;
    findAllHttp(accountId?: string): Promise<import("./entities/transfer.entity").Transfer[]>;
    findOneHttp(id: string): Promise<import("./entities/transfer.entity").Transfer>;
    create(dto: CreateTransferDto): Promise<import("./entities/transfer.entity").Transfer>;
    findAll(data?: {
        accountId?: string;
    }): Promise<import("./entities/transfer.entity").Transfer[]>;
    findOne(data: {
        id: string;
    }): Promise<import("./entities/transfer.entity").Transfer>;
}
