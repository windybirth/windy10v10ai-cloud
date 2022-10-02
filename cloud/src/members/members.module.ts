import { Module } from '@nestjs/common';
import { FireormModule } from 'nestjs-fireorm';

import { Order } from './entities/order.entity';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { OrdersService } from './orders.service';

@Module({
  imports: [FireormModule.forFeature([Order])],
  controllers: [MembersController],
  providers: [MembersService, OrdersService],
})
export class MembersModule {}
