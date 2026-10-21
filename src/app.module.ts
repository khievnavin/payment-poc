import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentModule } from './payment/payment.module';
import { AccountModule } from './account/account.module';
import { TransferModule } from './transfer/transfer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Payments are kept in PostgreSQL (docker compose service "db").
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>(
          'DATABASE_URL',
          'postgres://payment_service:payment_service@127.0.0.1:5436/payment_service',
        ),
        autoLoadEntities: true,
        // Creates / updates the table from the entity (development only).
        synchronize: config.get<string>('DB_SYNCHRONIZE', 'true') === 'true',
      }),
    }),
    PaymentModule,
    AccountModule,
    TransferModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
