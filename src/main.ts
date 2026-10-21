import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Manual test UI for the REST endpoints, served at /ui.
  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/ui' });

  // Connect the Redis transport so other microservices (e.g. order-service)
  // can call this service via @MessagePattern instead of HTTP.
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.REDIS,
      options: {
        host: config.get<string>('REDIS_HOST', 'localhost'),
        port: config.get<number>('REDIS_PORT', 6379),
      },
    },
    // Messages over Redis get the same ValidationPipe as HTTP requests.
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();

  const httpPort = config.get<number>('PORT', 3001);
  await app.listen(httpPort);

  console.log(`Payment service HTTP listening on port ${httpPort}`);
  console.log(
    `Payment service microservice (Redis) connected at ${config.get(
      'REDIS_HOST',
      'localhost',
    )}:${config.get('REDIS_PORT', 6379)}`,
  );
}
void bootstrap();
