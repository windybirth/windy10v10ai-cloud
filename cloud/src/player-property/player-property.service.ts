import * as fs from 'fs';

import { BadRequestException, Injectable } from '@nestjs/common';
import { parse } from 'csv-parse/sync';
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

  async getAll() {
    return this.playerPropertyRepository.find();
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
      if (player) {
        returnString += `${player.id},${player.memberLevel},${player.memberPointTotal}\n`;
      }
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
    const propertyData = fs.readFileSync('src/player-property/property.csv');
    const propertyList = parse(propertyData, {
      // key for each property
      columns: true,
      // skip the first line
      skip_empty_lines: true,
    });
    for (const property of propertyList) {
      // property get keys
      const propertyKeys = Object.keys(property);
      for (const propertyKey of propertyKeys) {
        // if property key is not steamId
        if (propertyKey !== 'steamId') {
          if (property[propertyKey] !== '') {
            await this.update({
              steamId: property.steamId,
              name: propertyKey,
              level: Number(property[propertyKey]),
            });
          }
        }
      }
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

  memberLevelList = [
    { steamId: 136407523, level: 31 },
    { steamId: 1194383041, level: 54 },
    { steamId: 385130282, level: 43 },
    { steamId: 136668998, level: 76 },
    { steamId: 128984820, level: 74 },
    { steamId: 117417953, level: 2 },
    { steamId: 353885092, level: 32 },
    { steamId: 251171524, level: 12 },
    { steamId: 882465781, level: 6 },
    { steamId: 907056028, level: 39 },
    { steamId: 342049002, level: 41 },
    { steamId: 208461180, level: 6 },
    { steamId: 445619710, level: 6 },
    { steamId: 322271699, level: 3 },
    { steamId: 1166147496, level: 9 },
    { steamId: 108208968, level: 3 },
    { steamId: 156694017, level: 9 },
    { steamId: 138652140, level: 7 },
    { steamId: 107625818, level: 25 },
    { steamId: 153632407, level: 48 },
    { steamId: 887874899, level: 15 },
    { steamId: 171217775, level: 66 },
    { steamId: 120921523, level: 119 },
    { steamId: 213346065, level: 18 },
    { steamId: 129972639, level: 2 },
    { steamId: 140769251, level: 3 },
    { steamId: 849959529, level: 2 },
    { steamId: 129797279, level: 8 },
    { steamId: 295200117, level: 8 },
    { steamId: 141805019, level: 4 },
    { steamId: 112073229, level: 8 },
    { steamId: 193859368, level: 4 },
    { steamId: 118324486, level: 5 },
    { steamId: 314643375, level: 32 },
    { steamId: 139073897, level: 12 },
    { steamId: 245559423, level: 80 },
    { steamId: 1033313629, level: 50 },
    { steamId: 330994098, level: 2 },
    { steamId: 150252080, level: 8 },
    { steamId: 908271686, level: 48 },
    { steamId: 160996305, level: 8 },
    { steamId: 59388035, level: 6 },
    { steamId: 1159610111, level: 21 },
    { steamId: 115909929, level: 28 },
    { steamId: 231445049, level: 2 },
    { steamId: 118184749, level: 26 },
    { steamId: 292827485, level: 38 },
    { steamId: 195850772, level: 8 },
    { steamId: 99825061, level: 16 },
    { steamId: 215738002, level: 20 },
    { steamId: 455689605, level: 14 },
    { steamId: 128131041, level: 8 },
    { steamId: 186715813, level: 2 },
    { steamId: 136373823, level: 3 },
    { steamId: 152852224, level: 24 },
  ];
}
