import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';

import { PlayerService } from '../player/player.service';

import { CreatePlayerPropertyDto } from './dto/create-player-property.dto';
import { UpdatePlayerPropertyDto } from './dto/update-player-property.dto';
import { PlayerProperty } from './entities/player-property.entity';

@Injectable()
export class PlayerPropertyService {
  static PROPERTY_NAME_LIST = [
    'property_cooldown_percentage',
    'property_cast_range_bonus_stacking',
    'property_spell_amplify_percentage',
    'property_status_resistance_stacking',
    'property_magical_resistance_bonus',
    'property_attack_range_bonus',
    'property_physical_armor_bonus',
    'property_preattack_bonus_damage',
    'property_attackspeed_bonus_constant',
    'property_stats_strength_bonus',
    'property_stats_agility_bonus',
    'property_stats_intellect_bonus',
    'property_health_regen_percentage',
    'property_mana_regen_total_percentage',
    'property_lifesteal',
    'property_spell_lifesteal',
    'property_movespeed_bonus_constant',
    'property_ignore_movespeed_limit',
    'property_cannot_miss',
  ];

  constructor(
    @InjectRepository(PlayerProperty)
    private readonly playerPropertyRepository: BaseFirestoreRepository<PlayerProperty>,
    private readonly playerService: PlayerService,
  ) {}
  async create(createPlayerPropertyDto: CreatePlayerPropertyDto) {
    this.validatePropertyName(createPlayerPropertyDto.name);
    await this.cheakPlayerLevel(
      createPlayerPropertyDto.steamId,
      createPlayerPropertyDto.level,
    );
    return this.playerPropertyRepository.create({
      id: this.buildId(
        createPlayerPropertyDto.steamId,
        createPlayerPropertyDto.name,
      ),
      ...createPlayerPropertyDto,
    });
  }
  async update(updatePlayerPropertyDto: UpdatePlayerPropertyDto) {
    this.validatePropertyName(updatePlayerPropertyDto.name);
    const existPlayerProperty = await this.playerPropertyRepository.findById(
      this.buildId(
        updatePlayerPropertyDto.steamId,
        updatePlayerPropertyDto.name,
      ),
    );

    if (existPlayerProperty) {
      await this.cheakPlayerLevel(
        updatePlayerPropertyDto.steamId,
        updatePlayerPropertyDto.level - existPlayerProperty.level,
      );
      existPlayerProperty.level = updatePlayerPropertyDto.level;
      return this.playerPropertyRepository.update(existPlayerProperty);
    } else {
      return this.create({ ...updatePlayerPropertyDto });
    }
  }

  async getMemberLevelList() {
    let returnString = '';
    const memberSteamIdList = this.memberLevelList.map(
      (memberLevel) => memberLevel.steamId,
    );
    for (const steamId of memberSteamIdList) {
      const steamIdStrList = steamId.toString().split('#');
      const player = (
        await this.playerService.findBySteamIdsWithLevelInfo(steamIdStrList)
      )[0];
      returnString += `${player.id},${player.memberLevel},${player.memberPointTotal}\n`;
    }
    return returnString;
  }
  async initialLevel() {
    for (const memberLevel of this.memberLevelList) {
      await this.playerService.setMemberLevel(
        memberLevel.steamId,
        memberLevel.level,
      );
    }
  }

  async initialProperty() {
    for (const createPlayerPropertyDto of this.createPlayerPropertyDtoList) {
      await this.update(createPlayerPropertyDto);
    }
  }
  findBySteamId(steamId: number) {
    return this.playerPropertyRepository
      .whereEqualTo('steamId', steamId)
      .find();
  }

  async getPlayerUsedLevel(steamId: number) {
    const playerProperties = await this.findBySteamId(steamId);
    let usedLevel = 0;
    playerProperties.forEach((playerProperty) => {
      usedLevel += playerProperty.level;
    });
    return usedLevel;
  }

  private async cheakPlayerLevel(steamId: number, levelAdd: number) {
    const totalLevel = await this.playerService.getPlayerTotalLevel(steamId);
    const usedLevel = await this.getPlayerUsedLevel(steamId);
    if (totalLevel < usedLevel + levelAdd) {
      console.error(
        'cheakPlayerLevel error',
        `steamId ${steamId}`,
        `totalLevel ${totalLevel}`,
        `usedLevel ${usedLevel}`,
        `levelAdd ${levelAdd}`,
      );
      throw new BadRequestException();
    }
  }
  private validatePropertyName(name: string) {
    if (!PlayerPropertyService.PROPERTY_NAME_LIST.includes(name)) {
      console.error('validatePropertyName error', `name ${name}`);
      throw new BadRequestException();
    }
  }
  private buildId(steamId: number, name: string) {
    return steamId.toString() + '#' + name;
  }

  // 136407523  31
  // 1194383041  31
  memberLevelList = [
    {
      steamId: 136407523,
      level: 31,
    },
    {
      steamId: 1194383041,
      level: 31,
    },
  ];
  // Name	property_cooldown_percentage	property_status_resistance_stacking	property_cast_range_bonus_stacking
  // 136407523	8	8	8
  // 1194383041	8
  createPlayerPropertyDtoList = [
    {
      steamId: 136407523,
      name: 'property_cooldown_percentage',
      level: 8,
    },
    {
      steamId: 136407523,
      name: 'property_status_resistance_stacking',
      level: 8,
    },
    {
      steamId: 136407523,
      name: 'property_cast_range_bonus_stacking',
      level: 8,
    },
    {
      steamId: 1194383041,
      name: 'property_cooldown_percentage',
      level: 8,
    },
  ];
}
