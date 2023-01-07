import { Module } from '@nestjs/common';
import { FireormModule } from 'nestjs-fireorm';

import { Order } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [FireormModule.forFeature([Order])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService, FireormModule],
})
export class OrdersModule {}
