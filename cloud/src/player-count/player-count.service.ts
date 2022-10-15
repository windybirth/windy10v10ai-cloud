import { Injectable } from '@nestjs/common';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';

import { UpdatePlayerCountDto } from './dto/player-count.dto';
import { PlayerCount } from './entities/player-count.entity';

@Injectable()
export class PlayerCountService {
  constructor(
    @InjectRepository(PlayerCount)
    private readonly gamePlayerCountRepository: BaseFirestoreRepository<PlayerCount>,
  ) {}
  async update(countDto: UpdatePlayerCountDto) {
    const id = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    const gamePlayerCountExist = await this.gamePlayerCountRepository.findById(
      id,
    );
    if (gamePlayerCountExist) {
      gamePlayerCountExist.addPlayerCount(countDto);
      await this.gamePlayerCountRepository.update(gamePlayerCountExist);
    } else {
      const gamePlayerCount = new PlayerCount();
      gamePlayerCount.init(id);
      gamePlayerCount.addPlayerCount(countDto);
      await this.gamePlayerCountRepository.create(gamePlayerCount);
    }

    return `This action update gamePlayerCount`;
  }
  async findAll() {
    return await this.gamePlayerCountRepository.find();
  }
}
