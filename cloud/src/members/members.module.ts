import { Module } from '@nestjs/common';
import { FireormModule } from 'nestjs-fireorm';

import { Game } from './entities/game.entity';
import { Order } from './entities/order.entity';
import { GamesService } from './games.service';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { OrdersService } from './orders.service';

@Module({
  imports: [FireormModule.forFeature([Order, Game])],
  controllers: [MembersController],
  providers: [MembersService, OrdersService, GamesService],
})
export class MembersModule {}
