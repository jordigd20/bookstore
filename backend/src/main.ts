import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('APP');

  await app.listen(process.env.PORT);
  logger.log(`Application listening on port ${process.env.PORT}`);
}
bootstrap();
