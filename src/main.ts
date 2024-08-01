import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './utils/filter/http-exception.filter';
import { setupSwagger } from './utils/middleware/swagger.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  setupSwagger(app);
  app.use(cookieParser());
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`listening on port ${port}`);
}
bootstrap();
