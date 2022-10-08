import { Module } from '@nestjs/common';

import { MembersModule } from './../members/members.module';
import { OrdersModule } from './../orders/orders.module';
import { AfdianController } from './afdian.controller';
import { AfdianService } from './afdian.service';

@Module({
  imports: [MembersModule, OrdersModule],
  controllers: [AfdianController],
  providers: [AfdianService],
})
export class AfdianModule {}
