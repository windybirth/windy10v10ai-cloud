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
    if (isMember) {
      if (
        !player?.lastMatchTime ||
        player.lastMatchTime.getTime() < todayZero.getTime()
      ) {
        memberDailyPoint = +process.env.MEMBER_DAILY_POINT;
      }
      if (isNaN(memberDailyPoint)) {
        memberDailyPoint = 0;
      }
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
    if (isNaN(seasonPoint)) {
      seasonPoint = 0;
    }
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

  async findAll() {
    return this.playerRepository.find();
  }

  async fixPlayers() {
    // const players = await this.playerRepository.find();
    // for (const player of players) {
    //   // set player.chargePointTotal multi 0.6
    //   player.chargePointUsable = Math.floor(player.chargePointUsable * 0.6);
    //   player.chargePointTotal = Math.floor(player.chargePointTotal * 0.6);
    //   await this.playerRepository.update(player);
    // }
  }

  async count() {
    const players = await this.playerRepository.find();
    return players.length;
  }
}
