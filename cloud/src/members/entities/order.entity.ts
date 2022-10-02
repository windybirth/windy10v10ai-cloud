import { Collection } from 'fireorm';

import { OrderDto } from '../dto/afdian-webhook.dto';

@Collection()
export class Order {
  id: string;
  platform: string;
  // member:会员订单,others:其他订单
  orderType: string;
  success: boolean;
  steamId: number;
  createdAt: Date;
  orderDto: OrderDto;
}
