import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { AppGlobalSettings } from './util/settings';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  AppGlobalSettings(app);

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Windy10v10 Cloud API')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-doc', app, document);
  }
  await app.listen(3000);
}

bootstrap();
