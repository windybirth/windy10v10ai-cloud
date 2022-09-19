import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { initializeApp } from 'firebase-admin/app';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MembersModule } from './members/members.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    MembersModule,
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    // Initialize the firebase admin app
    if (ENV === 'develop') {
      const app = initializeApp({
        storageBucket: process.env.STORAGE_BUCKET,
        databaseURL: 'http://127.0.0.1:9000/?ns=windy10v10ai-default-rtdb',
        projectId: 'windy10v10ai',
      });
      console.log(app);
    } else {
      const app = initializeApp();
    }
    console.log('[NestJs] firebase admin initialized.');
  }
}
