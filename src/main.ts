import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AppConfig } from 'src/app/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(AppConfig);

  app.setGlobalPrefix('api');

  await app.listen(appConfig.APP_PORT);
}
bootstrap();
