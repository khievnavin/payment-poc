import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { DepositDto } from './dto/deposit.dto';
import { UpdateAccountStatusDto } from './dto/update-account-status.dto';
import { AccountStatus } from './entities/account.entity';
import { AccountPatterns } from './account.patterns';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  // --- HTTP REST endpoints ---

  @Post()
  createHttp(@Body() dto: CreateAccountDto) {
    return this.accountService.create(dto);
  }

  @Get()
  findAllHttp() {
    return this.accountService.findAll();
  }

  @Get(':id')
  findOneHttp(@Param('id') id: string) {
    return this.accountService.findOne(id);
  }

  @Post(':id/deposit')
  depositHttp(@Param('id') id: string, @Body() dto: DepositDto) {
    return this.accountService.deposit(id, dto.amount);
  }

  @Post(':id/status')
  updateStatusHttp(
    @Param('id') id: string,
    @Body() dto: UpdateAccountStatusDto,
  ) {
    return this.accountService.updateStatus(id, dto.status);
  }

  // --- Microservice message patterns ---

  @MessagePattern(AccountPatterns.CREATE)
  create(@Payload() dto: CreateAccountDto) {
    return this.accountService.create(dto);
  }

  @MessagePattern(AccountPatterns.FIND_ALL)
  findAll() {
    return this.accountService.findAll();
  }

  @MessagePattern(AccountPatterns.FIND_ONE)
  findOne(@Payload() data: { id: string }) {
    return this.accountService.findOne(data.id);
  }

  @MessagePattern(AccountPatterns.DEPOSIT)
  deposit(@Payload() data: { id: string; amount: number }) {
    return this.accountService.deposit(data.id, data.amount);
  }

  @MessagePattern(AccountPatterns.UPDATE_STATUS)
  updateStatus(@Payload() data: { id: string; status: AccountStatus }) {
    return this.accountService.updateStatus(data.id, data.status);
  }
}
