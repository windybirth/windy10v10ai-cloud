import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { initializeApp } from 'firebase-admin/app';
import { FireormModule } from 'nestjs-fireorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MembersModule } from './members/members.module';
import { GameModule } from './game/game.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    MembersModule,
    ConfigModule.forRoot({
      envFilePath: `envs/${ENV}.env`,
      isGlobal: true,
    }),
    FireormModule.forRoot({
      firestoreSettings: {
        ignoreUndefinedProperties: true,
      },
      fireormSettings: {
        validateModels: true,
      },
    }),
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    // Initialize the firebase admin app
    if (ENV === 'develop') {
      initializeApp({
        storageBucket: 'windy10v10ai.appspot.com',
        databaseURL: 'http://127.0.0.1:9000/?ns=windy10v10ai-default-rtdb',
        projectId: 'windy10v10ai',
      });
    } else {
      initializeApp();
    }
  }
}
