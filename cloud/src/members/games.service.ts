import { Injectable } from '@nestjs/common';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';

import { Game } from './entities/game.entity';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: BaseFirestoreRepository<Game>,
  ) {}
  async recordMembersGame(
    matchId: string,
    apiKey: string,
    countryCode: string,
    steamIds: number[],
    memberPlayerCount: number,
  ) {
    let id = undefined;
    if (matchId === '0') {
      id = matchId;
    }
    try {
      return await this.gameRepository.create({
        id,
        matchId,
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

  async countgames() {
    const countAll = (await this.gameRepository.find()).length;
    console.log('countAll', countAll);
    const countryCodeCN = (
      await this.gameRepository.whereEqualTo('countryCode', 'CN').find()
    ).length;
    const countryCodeOther = (
      await this.gameRepository.whereNotEqualTo('countryCode', 'CN').find()
    ).length;
    const countryCodeHK = (
      await this.gameRepository.whereEqualTo('countryCode', 'HK').find()
    ).length;
    const countryCodeUS = (
      await this.gameRepository.whereEqualTo('countryCode', 'US').find()
    ).length;
    const serverLocal = (
      await this.gameRepository
        .whereEqualTo('apiKey', 'Invalid_NotOnDedicatedServer')
        .find()
    ).length;
    const serverServer = (
      await this.gameRepository
        .whereEqualTo('apiKey', '3FFCF5A5F09CE52B9DC2F34E022395A31475208C')
        .find()
    ).length;
    const playerCount1 = (
      await this.gameRepository.whereEqualTo('playerCount', 1).find()
    ).length;
    const playerCount2to5 = (
      await this.gameRepository
        .whereGreaterOrEqualThan('playerCount', 2)
        .whereLessOrEqualThan('playerCount', 5)
        .find()
    ).length;
    const playerCount6to9 = (
      await this.gameRepository
        .whereGreaterOrEqualThan('playerCount', 6)
        .whereLessOrEqualThan('playerCount', 9)
        .find()
    ).length;
    const playerCount10 = (
      await this.gameRepository.whereEqualTo('playerCount', 10).find()
    ).length;
    const memberCount0 = (
      await this.gameRepository.whereEqualTo('memberPlayerCount', 0).find()
    ).length;
    const memberCountNot0 = (
      await this.gameRepository
        .whereGreaterOrEqualThan('memberPlayerCount', 1)
        .find()
    ).length;
    return {
      countAll,
      countryCode: {
        CN: countryCodeCN,
        Other: countryCodeOther,
        Others: { HK: countryCodeHK, US: countryCodeUS },
      },
      serverType: {
        local: serverLocal,
        server: serverServer,
      },
      playerCount: {
        p1: playerCount1,
        p2to5: playerCount2to5,
        p6to9: playerCount6to9,
        p10: playerCount10,
      },
      memberCount: {
        m0: memberCount0,
        mNot0: memberCountNot0,
      },
    };
  }
}
