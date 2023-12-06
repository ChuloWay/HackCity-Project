import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as morgan from 'morgan';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);
  app.use(morgan('tiny'));
  app.setGlobalPrefix('api/v1');

  await app
    .listen(process.env.PORT || 3500)
    .then(() => logger.log(`Server started on: localhost:${process.env.PORT}`))
    .catch((err) => {
      logger.error('>>> App error: ', err);
    });
}

bootstrap();
