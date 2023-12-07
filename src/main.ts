import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import { CustomExceptionFilter } from './utils/custom-exception-filter';
import helmet from 'helmet';
import * as cors from 'cors';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.use(helmet());

  app.use(cors());

  const customExceptionFilter = new CustomExceptionFilter(httpAdapterHost);
  app.useGlobalFilters(customExceptionFilter);
  app.use(morgan('tiny'));
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  try {
    await app.listen(process.env.PORT || 3500);
    logger.log(`Server started on: localhost:${process.env.PORT}/api/v1`);
  } catch (err) {
    logger.error('>>> App error: ', err);
  }
}

bootstrap();
