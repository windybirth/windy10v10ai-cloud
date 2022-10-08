import { Module } from '@nestjs/common';
import { FireormModule } from 'nestjs-fireorm';

import { Game } from './entities/game.entity';
import { GamesService } from './games.service';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';

@Module({
  imports: [FireormModule.forFeature([Game])],
  controllers: [MembersController],
  providers: [MembersService, GamesService],
  exports: [MembersService],
})
export class MembersModule {}
