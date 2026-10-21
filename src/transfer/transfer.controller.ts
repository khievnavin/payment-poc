import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransferService } from './transfer.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransferPatterns } from './transfer.patterns';

@Controller('transfers')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  // --- HTTP REST endpoints ---

  @Post()
  createHttp(@Body() dto: CreateTransferDto) {
    return this.transferService.create(dto);
  }

  // ?accountId=user-1 returns only transfers that user sent or received.
  @Get()
  findAllHttp(@Query('accountId') accountId?: string) {
    return this.transferService.findAll(accountId);
  }

  @Get(':id')
  findOneHttp(@Param('id') id: string) {
    return this.transferService.findOne(id);
  }

  // --- Microservice message patterns ---

  @MessagePattern(TransferPatterns.CREATE)
  create(@Payload() dto: CreateTransferDto) {
    return this.transferService.create(dto);
  }

  @MessagePattern(TransferPatterns.FIND_ALL)
  findAll(@Payload() data?: { accountId?: string }) {
    return this.transferService.findAll(data?.accountId);
  }

  @MessagePattern(TransferPatterns.FIND_ONE)
  findOne(@Payload() data: { id: string }) {
    return this.transferService.findOne(data.id);
  }
}
