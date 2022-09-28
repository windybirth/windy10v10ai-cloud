import { OrderDto } from '../dto/afdian-webhook.dto';

export class Order extends OrderDto {
  platform: string;
  // member:会员订单,others:其他订单
  orderType: string;
  // 处理状态
  sucess: boolean;
  steamId: number;
  createdAt: Date;
}
