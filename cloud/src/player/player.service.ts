import { Injectable } from '@nestjs/common';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';

import { PlayerDto } from './dto/player.dto';
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
        memberPointTotal: memberDailyPoint,
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
        memberPointTotal: 0,
        lastMatchTime: new Date(),
      };
      await this.playerRepository.create(newPlayer);
    }
  }

  async findAll() {
    return this.playerRepository.find();
  }

  async findBySteamIds(ids: string[]): Promise<Player[]> {
    const players = await this.playerRepository.whereIn('id', ids).find();
    return players;
  }

  async findBySteamIdsWithLevelInfo(ids: string[]): Promise<PlayerDto[]> {
    const players = (await this.findBySteamIds(ids)) as PlayerDto[];
    for (const player of players) {
      const seasonPoint = player.seasonPointTotal;
      const seasonLevel = this.getSeasonLevelBuyPoint(seasonPoint);
      player.seasonLevel = seasonLevel;
      player.seasonCurrrentLevelPoint =
        seasonPoint - this.getSeasonTotalPoint(seasonLevel);
      player.seasonNextLevelPoint = this.getSeasonNextLevelPoint(
        seasonLevel + 1,
      );

      const memberPoint = player.chargePointTotal;
      const memberLevel = this.getMemberLevelBuyPoint(memberPoint);
      player.memberLevel = memberLevel;
      player.seasonCurrrentLevelPoint =
        memberPoint - this.getMemberTotalPoint(memberLevel);
      player.seasonNextLevelPoint = this.getMemberNextLevelPoint(
        memberLevel + 1,
      );
    }
    return players;
  }

  async fixPlayers() {
    const players = await this.playerRepository.find();
    for (const player of players) {
      player.memberPointTotal = player.chargePointTotal;
      await this.playerRepository.update(player);
    }
  }

  async count() {
    const players = await this.playerRepository.find();
    return players.length;
  }
  async scoreAll() {
    const players = await this.playerRepository.find();
    let returnString = '';
    // seasonPointTotal, matchCount
    // create csv
    for (const player of players) {
      returnString += `${player.id},${player.seasonPointTotal},${player.matchCount},${player.winCount},${player.disconnectCount}\n`;
    }

    return returnString;
  }

  // 赛季积分
  // 升级所需积分 level 目标等级
  getSeasonNextLevelPoint(level: number) {
    return 100 * (level + 4);
  }
  // 等级所需累计积分 level 目标等级
  getSeasonTotalPoint(level: number) {
    return 100 * ((level * level) / 2 + level * 4.5);
  }
  // 根据积分获取当前等级
  getSeasonLevelBuyPoint(point: number) {
    return Math.floor(Math.sqrt(point / 50 + 20.25) - 4.5);
  }

  // 会员积分
  // 升级所需积分 level 目标等级
  getMemberNextLevelPoint(level: number) {
    return 50 * (level + 19);
  }
  // 等级所需累计积分 level 目标等级
  getMemberTotalPoint(level: number) {
    return 100 * ((level * level) / 4 + level * 9.75);
  }
  // 根据积分获取当前等级
  getMemberLevelBuyPoint(point: number) {
    return Math.floor(Math.sqrt(point / 25 + 380.25) - 19.5);
  }
}
