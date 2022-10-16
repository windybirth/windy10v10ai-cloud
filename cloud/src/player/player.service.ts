import { Injectable } from '@nestjs/common';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';

import { Player } from './entities/player.entity';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: BaseFirestoreRepository<Player>,
  ) {}

  async gameEnd(steamId: number, isWinner: boolean, seasonPoint: number) {
    const player = await this.playerRepository.findById(steamId.toString());
    if (player) {
      player.matchCount++;
      if (isWinner) {
        player.winCount++;
      }
      player.seasonPointUsable += seasonPoint;
      player.seasonPointTotal += seasonPoint;
      await this.playerRepository.update(player);
    } else {
      const newPlayer = {
        id: steamId.toString(),
        matchCount: 1,
        winCount: isWinner ? 1 : 0,
        seasonPointUsable: seasonPoint,
        seasonPointTotal: seasonPoint,
        chargePointUsable: 0,
        chargePointTotal: 0,
      };
      await this.playerRepository.create(newPlayer);
    }
  }

  findAll() {
    return this.playerRepository.find();
  }
}
