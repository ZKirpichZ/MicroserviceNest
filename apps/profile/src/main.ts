import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ProfileModule } from './profile.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(ProfileModule);
  const configService = app.get(ConfigService);

  const QUEUE = configService.get('RABBITMQ_PROFILE_QUEUE');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://rabbitmq:5672`],
      noAck: false,
      queue: QUEUE,
      queueOptions: {
        durable: true,
      },
    },
  });
  app.startAllMicroservices();
}
bootstrap();