import { Injectable } from '@nestjs/common';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';

import { MembersService } from '../members/members.service';
import { Order } from '../orders/entities/order.entity';

import { OrderDto } from './dto/afdian-webhook.dto';

enum Platfrom {
  afdian = 'afdian',
}
enum OrderType {
  member = 'member',
  others = 'others',
}

@Injectable()
export class AfdianService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: BaseFirestoreRepository<Order>,
    private readonly membersService: MembersService,
  ) {}
  async processAfdianOrder(orderDto: OrderDto) {
    let success = true;
    // status = 2（交易成功） and product_type = 0（常规方案）and month > 0（订阅1个月以上）
    if (orderDto.status !== 2) {
      success = false;
    }
    if (orderDto.product_type !== 0) {
      success = false;
    }
    const month = orderDto.month;
    if (month <= 0) {
      success = false;
    }
    const steamId = this.extractSteamIdFromAfdianOrderDto(orderDto);
    if (!steamId) {
      success = false;
    }
    if (success) {
      await this.membersService.createMember({ steamId, month });
    }

    const orderType = OrderType.member;
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
    // 查找顺序 address_address address_phone address_person remark
    const steamId_address = this.extractSteamId(orderDto.address_address);
    if (steamId_address) {
      return steamId_address;
    }
    const steamId_phone = this.extractSteamId(orderDto.address_phone);
    if (steamId_phone) {
      return steamId_phone;
    }
    const steamId_person = this.extractSteamId(orderDto.address_person);
    if (steamId_person) {
      return steamId_person;
    }
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
