import { Module } from '@nestjs/common';
import { AccountModule } from '../account/account.module';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';

@Module({
  imports: [AccountModule],
  controllers: [TransferController],
  providers: [TransferService],
})
export class TransferModule {}
