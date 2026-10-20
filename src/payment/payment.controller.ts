import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import { PaymentPatterns } from './payment.patterns';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // --- HTTP REST endpoints (health checks, direct testing, gateway use) ---

  @Post()
  createHttp(@Body() dto: CreatePaymentDto) {
    return this.paymentService.create(dto);
  }

  @Get()
  findAllHttp() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  findOneHttp(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @Post(':id/refund')
  refundHttp(@Param('id') id: string, @Body() dto: RefundPaymentDto) {
    return this.paymentService.refund(id, dto.reason);
  }

  // --- Microservice message patterns (called by other services over Redis) ---

  @MessagePattern(PaymentPatterns.CREATE)
  create(@Payload() dto: CreatePaymentDto) {
    return this.paymentService.create(dto);
  }

  @MessagePattern(PaymentPatterns.FIND_ALL)
  findAll() {
    return this.paymentService.findAll();
  }

  @MessagePattern(PaymentPatterns.FIND_ONE)
  findOne(@Payload() data: { id: string }) {
    return this.paymentService.findOne(data.id);
  }

  @MessagePattern(PaymentPatterns.REFUND)
  refund(@Payload() data: { id: string; reason?: string }) {
    return this.paymentService.refund(data.id, data.reason);
  }
}
