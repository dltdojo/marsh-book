import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.static('public'));
  app.use(cors());
  // GET localhost:3000/api/v1/api-method
  app.setGlobalPrefix('/api/v1');
  await app.listen(3000);
}
bootstrap();
