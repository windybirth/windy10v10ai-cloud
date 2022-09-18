import { Module } from '@nestjs/common';
import { getApp, initializeApp } from 'firebase-admin/app';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MembersModule } from './members/members.module';

@Module({
  imports: [MembersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    // For debug and e2e test
    // initializeApp({
    //   storageBucket: 'windy10v10ai.appspot.com',
    //   databaseURL: 'http://127.0.0.1:9000/?ns=windy10v10ai-default-rtdb',
    //   projectId: 'windy10v10ai',
    // });
    // Initialize the firebase admin app
    initializeApp();
    console.log('[NestJs] firebase admin initialized.');
  }
}
