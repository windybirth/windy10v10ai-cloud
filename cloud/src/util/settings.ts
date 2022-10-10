import { INestApplication, ValidationPipe } from '@nestjs/common';

export function AppGlobalSettings(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
}
