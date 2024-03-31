import { Module } from '@nestjs/common';

import { MembersModule } from '../members/members.module';
import { PlayerModule } from '../player/player.module';
import { PlayerPropertyModule } from '../player-property/player-property.module';

import { TestController } from './test.controller';

@Module({
  imports: [PlayerModule, PlayerPropertyModule, MembersModule],
  controllers: [TestController],
})
export class TestModule {}
