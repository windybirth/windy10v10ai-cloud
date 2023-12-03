import { Module } from '@nestjs/common';
import { FireormModule } from 'nestjs-fireorm';

import { EventReward } from './entities/event-reward.entity';
import { EventRewardsController } from './event-rewards.controller';
import { EventRewardsService } from './event-rewards.service';

@Module({
  imports: [FireormModule.forFeature([EventReward])],
  controllers: [EventRewardsController],
  providers: [EventRewardsService],
  exports: [EventRewardsService],
})
export class EventRewardsModule {}
