import { Injectable } from '@nestjs/common';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';

import { Game } from './entities/game.entity';

enum mapType {
  windy = 'windy',
  anime = 'anime',
}

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: BaseFirestoreRepository<Game>,
  ) {}

  async recordMembersAllGame(countryCode: string) {
    try {
      return await this.gameRepository.create({
        matchId: null,
        mapType: mapType.anime,
        apiKey: null,
        countryCode,
        playerCount: 1,
        memberPlayerCount: null,
        steamIds: null,
        createdAt: new Date(),
      });
    } catch (error) {
      console.log('[ERROR] ', error.message);
    }
  }
  async recordMembersGame(
    matchId: string,
    apiKey: string,
    countryCode: string,
    steamIds: number[],
    memberPlayerCount: number,
  ) {
    try {
      return await this.gameRepository.create({
        id: matchId,
        matchId,
        mapType: mapType.windy,
        apiKey,
        countryCode,
        playerCount: steamIds.length,
        memberPlayerCount,
        steamIds,
        createdAt: new Date(),
      });
    } catch (error) {
      console.log('[ERROR] ', error.message);
    }
  }
}
