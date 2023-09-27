import { Injectable } from '@nestjs/common';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';

import { PlayerDto } from './dto/player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: BaseFirestoreRepository<Player>,
  ) {}

  // 创建新玩家
  async findSteamIdAndNewPlayer(steamId: number) {
    const existPlayer = await this.playerRepository.findById(
      steamId.toString(),
    );
    const player = existPlayer ?? this.genereNewPlayerEntity(steamId);
    if (!existPlayer) {
      await this.playerRepository.create(player);
    }
    return player;
  }

  // 更新会员积分
  upsertMemberPoint(player: Player, isMember: boolean) {
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
    return memberDailyPoint;
  }

  // 更新积分和最后游戏时间
  async updatePlayer(
    player: Player,
    seasonPointTotal: number,
    memberPointTotal: number,
  ) {
    player.lastMatchTime = new Date();
    player.seasonPointTotal += seasonPointTotal;
    player.memberPointTotal += memberPointTotal;
    await this.playerRepository.update(player);
    return player;
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
    if (steamId == 424859328) {
      seasonPoint = 0;
    }
    const existPlayer = await this.playerRepository.findById(
      steamId.toString(),
    );

    const player = existPlayer ?? this.genereNewPlayerEntity(steamId);

    player.matchCount++;
    if (isWinner) {
      player.winCount++;
    }
    player.seasonPointTotal += seasonPoint;
    if (isDisconnect) {
      player.disconnectCount++;
    }
    // 行为分计算
    if (isDisconnect) {
      player.conductPoint -= 5;
    } else {
      player.conductPoint += 1;
    }
    // conductPoint max 100 min 0
    player.conductPoint = Math.min(100, player.conductPoint);
    player.conductPoint = Math.max(0, player.conductPoint);

    if (existPlayer) {
      await this.playerRepository.update(player);
    } else {
      await this.playerRepository.create(player);
    }
  }

  async getPlayerTotalLevel(steamId: number) {
    const player = await this.playerRepository.findById(steamId.toString());
    if (!player) {
      return 0;
    }
    const seasonPoint = player.seasonPointTotal;
    const seasonLevel = this.getSeasonLevelBuyPoint(seasonPoint);
    const memberPoint = player.memberPointTotal;
    const memberLevel = this.getMemberLevelBuyPoint(memberPoint);
    return seasonLevel + memberLevel;
  }

  async findTop100SeasonPointSteamIds(): Promise<string[]> {
    const players = await this.playerRepository
      .orderByDescending('seasonPointTotal')
      .limit(201)
      .find();

    return players
      .filter((player) => player.id !== '424859328')
      .map((player) => player.id);
  }

  async findBySteamId(steamId: number) {
    return await this.playerRepository.findById(steamId.toString());
  }

  async findByIds(ids: string[]): Promise<Player[]> {
    const players = await this.playerRepository.whereIn('id', ids).find();
    return players;
  }

  async findBySteamIdsWithLevelInfo(ids: string[]): Promise<PlayerDto[]> {
    const players = (await this.findByIds(ids)) as PlayerDto[];
    for (const player of players) {
      const seasonPoint = player.seasonPointTotal;
      const seasonLevel = this.getSeasonLevelBuyPoint(seasonPoint);
      player.seasonLevel = seasonLevel;
      player.seasonCurrrentLevelPoint =
        seasonPoint - this.getSeasonTotalPoint(seasonLevel);
      player.seasonNextLevelPoint = this.getSeasonNextLevelPoint(seasonLevel);

      const memberPoint = player.memberPointTotal;
      const memberLevel = this.getMemberLevelBuyPoint(memberPoint);
      player.memberLevel = memberLevel;
      player.memberCurrentLevelPoint =
        memberPoint - this.getMemberTotalPoint(memberLevel);
      player.memberNextLevelPoint = this.getMemberNextLevelPoint(memberLevel);
    }
    return players;
  }

  async upsertAddPoint(steamId: number, updatePlayerDto: UpdatePlayerDto) {
    const existPlayer = await this.playerRepository.findById(
      steamId.toString(),
    );

    const player = existPlayer ?? this.genereNewPlayerEntity(steamId);
    if (updatePlayerDto.memberPointTotal) {
      player.memberPointTotal += updatePlayerDto.memberPointTotal;
    }
    if (updatePlayerDto.seasonPointTotal) {
      player.seasonPointTotal += updatePlayerDto.seasonPointTotal;
    }
    if (existPlayer) {
      return await this.playerRepository.update(player);
    } else {
      return await this.playerRepository.create(player);
    }
  }

  async countPlayerSeasonPointTotalMoreThan(points = 500) {
    const players = await this.playerRepository
      .whereGreaterThan('seasonPointTotal', points)
      .find();
    return players.length;
  }

  async resetSeasonPoint(resetPercent: number, baseSeasonPoint = 500) {
    // FIXME baseSeasonPoint以下的玩家无法记录上个赛季的积分
    const playersAll = await this.playerRepository
      .whereGreaterThan('seasonPointTotal', baseSeasonPoint)
      .find();
    const players = playersAll.filter(
      // FIXME 每个赛季需要修正
      (player) => player.secondSeasonLevel === undefined,
    );
    const seasonPointPercent = resetPercent / 100;

    let count = 0;
    for (const player of players) {
      count++;
      console.info(`Reset user count: ${count}`);

      // FIXME 每个赛季需要修正
      player.secondSeasonLevel = this.getSeasonLevelBuyPoint(
        player.seasonPointTotal,
      );
      player.seasonPointTotal = Math.floor(
        player.seasonPointTotal * seasonPointPercent,
      );
      await this.playerRepository.update(player);
    }
  }

  async addAllSeasonPoint(point: number, startFrom: Date) {
    const players = await this.playerRepository
      .whereGreaterOrEqualThan('lastMatchTime', startFrom)
      .find();
    for (const player of players) {
      player.seasonPointTotal += point;
      await this.playerRepository.update(player);
    }
    return players.length;
  }

  async setMemberLevel(steamId: number, level: number) {
    const point = this.getMemberTotalPoint(level);
    const existPlayer = await this.playerRepository.findById(
      steamId.toString(),
    );

    const player = existPlayer ?? this.genereNewPlayerEntity(steamId);

    player.memberPointTotal += point;
    if (existPlayer) {
      await this.playerRepository.update(player);
    } else {
      await this.playerRepository.create(player);
    }
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

  private genereNewPlayerEntity(steamId: number): Player {
    return {
      id: steamId.toString(),
      matchCount: 0,
      winCount: 0,
      disconnectCount: 0,
      seasonPointTotal: 0,
      memberPointTotal: 0,
      lastMatchTime: null,
      conductPoint: 100,
    };
  }

  /**
   * 赛季积分
   * @param level 当前等级
   * @returns 升级积分
   */
  getSeasonNextLevelPoint(level: number) {
    return 100 * level;
  }
  /**
   * 赛季积分 指定等级所需累计积分
   * @param level 指定等级
   * @returns 累计积分
   */
  getSeasonTotalPoint(level: number) {
    return 50 * (level - 1) * level;
  }
  // 根据积分获取当前等级
  getSeasonLevelBuyPoint(point: number) {
    return Math.floor(Math.sqrt(point / 50 + 0.25) + 0.5);
  }

  /**
   * 会员积分
   * @param level 当前等级
   * @returns 升级积分
   */
  getMemberNextLevelPoint(level: number) {
    return 50 * (level + 19);
  }
  /**
   * 会员积分
   * @param level 指定等级
   * @returns 累计积分
   */
  getMemberTotalPoint(level: number) {
    level -= 1;
    return 100 * ((level * level) / 4 + level * 9.75);
  }
  // 根据积分获取当前等级
  getMemberLevelBuyPoint(point: number) {
    return Math.floor(Math.sqrt(point / 25 + 380.25) - 19.5) + 1;
  }
}
