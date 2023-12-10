import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { initializeApp } from 'firebase-admin/app';
import { FireormModule } from 'nestjs-fireorm';

import { AdminModule } from './admin/admin.module';
import { AfdianModule } from './afdian/afdian.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CountModule } from './count/count.module';
import { EventRewardsModule } from './event-rewards/event-rewards.module';
import { GameModule } from './game/game.module';
import { MembersModule } from './members/members.module';
import { OrdersModule } from './orders/orders.module';
import { PlayerModule } from './player/player.module';
import { PlayerCountModule } from './player-count/player-count.module';
import { PlayerPropertyModule } from './player-property/player-property.module';
import { TestModule } from './test/test.module';

const ENVIRONMENT = process.env.ENVIRONMENT ?? 'local';

@Module({
  imports: [
    MembersModule,
    ConfigModule.forRoot({
      envFilePath: `.env.${ENVIRONMENT}`,
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
    CountModule,
    PlayerModule,
    PlayerPropertyModule,
    TestModule,
    AdminModule,
    EventRewardsModule,
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
