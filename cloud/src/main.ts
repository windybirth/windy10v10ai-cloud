import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { AppGlobalSettings } from './util/settings';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  AppGlobalSettings(app);
  await app.listen(3000);
}

bootstrap();
