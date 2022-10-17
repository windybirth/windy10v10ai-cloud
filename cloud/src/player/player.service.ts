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

  async upsertGameStart(steamId: number, isMember: boolean) {
    const player = await this.playerRepository.findById(steamId.toString());

    let memberDailyPoint = 0;

    const todayZero = new Date();
    todayZero.setHours(0, 0, 0, 0);
    if (
      isMember &&
      player?.lastMatchTime &&
      player.lastMatchTime.getTime() < todayZero.getTime()
    ) {
      memberDailyPoint = +process.env.MEMBER_DAILY_POINT;
    }

    if (player) {
      player.chargePointUsable += memberDailyPoint;
      player.chargePointTotal += memberDailyPoint;
      player.lastMatchTime = new Date();
      await this.playerRepository.update(player);
    } else {
      const newPlayer = {
        id: steamId.toString(),
        matchCount: 0,
        winCount: 0,
        disconnectCount: 0,
        seasonPointUsable: 0,
        seasonPointTotal: 0,
        chargePointUsable: memberDailyPoint,
        chargePointTotal: memberDailyPoint,
        lastMatchTime: new Date(),
      };
      await this.playerRepository.create(newPlayer);
    }
  }
  async upsertGameEnd(
    steamId: number,
    isWinner: boolean,
    seasonPoint: number,
    isDisconnect: boolean,
  ) {
    const player = await this.playerRepository.findById(steamId.toString());
    if (player) {
      player.matchCount++;
      if (isWinner) {
        player.winCount++;
      }
      player.seasonPointUsable += seasonPoint;
      player.seasonPointTotal += seasonPoint;
      if (isDisconnect) {
        player.disconnectCount++;
      }
      await this.playerRepository.update(player);
    } else {
      const newPlayer = {
        id: steamId.toString(),
        matchCount: 1,
        winCount: isWinner ? 1 : 0,
        disconnectCount: isDisconnect ? 1 : 0,
        seasonPointUsable: seasonPoint,
        seasonPointTotal: seasonPoint,
        chargePointUsable: 0,
        chargePointTotal: 0,
        lastMatchTime: new Date(),
      };
      await this.playerRepository.create(newPlayer);
    }
  }

  findAll() {
    return this.playerRepository.find();
  }

  async fixPlayers() {
    const players = await this.playerRepository.find();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    for (const player of players) {
      player.lastMatchTime = yesterday;
      player.seasonPointUsable = Math.floor(player.seasonPointUsable);
      player.seasonPointTotal = Math.floor(player.seasonPointTotal);
      await this.playerRepository.update(player);
    }
  }

  async count() {
    return this.playerRepository.find().then((players) => players.length);
  }
}
