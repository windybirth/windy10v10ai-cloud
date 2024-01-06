import { Module } from '@nestjs/common';

import { MembersModule } from '../members/members.module';
import { PlayerModule } from '../player/player.module';
import { PlayerPropertyModule } from '../player-property/player-property.module';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [MembersModule, PlayerModule, PlayerPropertyModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
