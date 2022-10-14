import { Injectable } from '@nestjs/common';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';

import { UpdateGamePlayerCountDto } from './dto/update-player-count.dto';
import { GamePlayerCount } from './entities/game-player-count.entity';

@Injectable()
export class PlayerCountService {
  constructor(
    @InjectRepository(GamePlayerCount)
    private readonly gamePlayerCountRepository: BaseFirestoreRepository<GamePlayerCount>,
  ) {}
  async update(countDto: UpdateGamePlayerCountDto) {
    const id = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const { countryCode, playerIds } = countDto;
    const playerCount = playerIds.length;

    let gamePlayerCount = await this.gamePlayerCountRepository.findById(id);
    if (!gamePlayerCount) {
      gamePlayerCount = new GamePlayerCount();
    }

    return `This action update gamePlayerCount: ${gamePlayerCount}`;
  }
}
