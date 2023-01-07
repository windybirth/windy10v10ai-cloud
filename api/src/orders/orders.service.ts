import { Injectable } from '@nestjs/common';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';

import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: BaseFirestoreRepository<Order>,
  ) {}

  findAll() {
    return this.orderRepository.orderByDescending('createdAt').find();
  }

  findFailed() {
    return this.orderRepository
      .whereEqualTo('success', false)
      .orderByDescending('createdAt')
      .find();
  }

  create(order: Order) {
    return this.orderRepository.create(order);
  }
}
