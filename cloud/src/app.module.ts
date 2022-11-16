import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { initializeApp } from 'firebase-admin/app';
import { FireormModule } from 'nestjs-fireorm';

import { AfdianModule } from './afdian/afdian.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { MatchModule } from './match/match.module';
import { MembersModule } from './members/members.module';
import { OrdersModule } from './orders/orders.module';
import { PlayerCountModule } from './player-count/player-count.module';
import { PlayerPropertyModule } from './player-property/player-property.module';
import { PlayerModule } from './player/player.module';

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
        projectId: 'windy10v10ai',
        ignoreUndefinedProperties: true,
      },
      fireormSettings: {
        validateModels: true,
      },
    }),
    GameModule,
    AfdianModule,
    OrdersModule,
    PlayerCountModule,
    MatchModule,
    PlayerModule,
    PlayerPropertyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    // Initialize the firebase admin app
    initializeApp();
  }
}
