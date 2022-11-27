import { Injectable } from '@nestjs/common';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';

import { MembersService } from '../members/members.service';
import { Order } from '../orders/entities/order.entity';
import { PlayerPropertyService } from '../player-property/player-property.service';
import { PlayerService } from '../player/player.service';

import { OrderDto } from './dto/afdian-webhook.dto';

enum Platfrom {
  afdian = 'afdian',
}
enum OrderType {
  member = 'member',
  goods1 = 'point3000',
  goods2 = 'point9800',
  goods3 = 'point26000',
  initialAttribute = 'initialAttribute',
  others = 'others',
}
enum ProductType {
  member = 0,
  goods = 1,
}

enum PlanId {
  tire1 = '6f73a48e546011eda08052540025c377',
  tire2 = '29df1632688911ed9e7052540025c377',
  tire3 = '0783fa70688a11edacd452540025c377',
  initialAttribute = '7bda7efc6e7111edb5b652540025c377',
}

enum PlanPoint {
  tire1 = 3000,
  tire2 = 9800,
  tire3 = 26000,
}

@Injectable()
export class AfdianService {
  private static MEMBER_MONTHLY_POINT = 300;
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: BaseFirestoreRepository<Order>,
    private readonly membersService: MembersService,
    private readonly playerService: PlayerService,
    private readonly playerPropertyService: PlayerPropertyService,
  ) {}

  async processAfdianOrder(orderDto: OrderDto) {
    let success = true;
    let orderType = OrderType.others;
    // status = 2（交易成功） and product_type = 0（常规方案）and month > 0（订阅1个月以上）
    if (orderDto.status !== 2) {
      success = false;
    }
    const steamId = this.extractSteamIdFromAfdianOrderDto(orderDto);
    if (!steamId) {
      success = false;
    }

    switch (orderDto.product_type) {
      case ProductType.member:
        orderType = OrderType.member;

        const month = orderDto.month;
        if (month <= 0) {
          success = false;
        }
        if (success) {
          await this.membersService.createMember({ steamId, month });
          await this.playerService.addMemberPoint(
            steamId,
            AfdianService.MEMBER_MONTHLY_POINT * month,
          );
        }
        break;

      case ProductType.goods:
        let planPoint = 0;
        switch (orderDto.plan_id) {
          case PlanId.tire1:
            orderType = OrderType.goods1;
            planPoint = PlanPoint.tire1;
            break;
          case PlanId.tire2:
            orderType = OrderType.goods2;
            planPoint = PlanPoint.tire2;
            break;
          case PlanId.tire3:
            orderType = OrderType.goods3;
            planPoint = PlanPoint.tire3;
            break;
          case PlanId.initialAttribute:
            orderType = OrderType.initialAttribute;
            planPoint = 0;
            break;
          default:
            success = false;
            break;
        }
        const goodsCount = Number(orderDto.sku_detail[0]?.count);
        if (isNaN(goodsCount) || goodsCount < 0) {
          success = false;
        }
        if (success) {
          const addPoint = planPoint * goodsCount;
          await this.playerService.addMemberPoint(steamId, addPoint);
        }
        if (orderType === OrderType.initialAttribute) {
          await this.playerPropertyService.deleteBySteamId(steamId);
        }

        break;

      default:
        success = false;
        break;
    }

    const orderEntity = {
      platform: Platfrom.afdian,
      orderType,
      success,
      steamId,
      createdAt: new Date(),
      orderDto: orderDto,
    };
    return this.orderRepository.create(orderEntity);
  }

  private extractSteamIdFromAfdianOrderDto(orderDto: OrderDto): number | null {
    // 查找remark
    const steamId_remark = this.extractSteamId(orderDto.remark);
    if (steamId_remark) {
      return steamId_remark;
    }

    return null;
  }

  // steamId要求，numberString 8~10位，混有其他字符的情况暂不考虑。
  private extractSteamId(rawString: string): number | null {
    if (!rawString) {
      return null;
    }
    if (rawString.length < 8 || rawString.length > 10) {
      return null;
    }
    if (isNaN(Number(rawString))) {
      return null;
    }
    return Number(rawString);
  }
}
