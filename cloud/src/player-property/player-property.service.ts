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
    'property_status_resistance_stacking',
    'property_cast_range_bonus_stacking',
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
      id:
        createPlayerPropertyDto.steamId.toString() +
        createPlayerPropertyDto.name,
      ...createPlayerPropertyDto,
    });
  }
  async update(updatePlayerPropertyDto: UpdatePlayerPropertyDto) {
    this.validatePropertyName(updatePlayerPropertyDto.name);
    const existPlayerProperty = await this.playerPropertyRepository.findById(
      updatePlayerPropertyDto.steamId.toString() + updatePlayerPropertyDto.name,
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
      throw new BadRequestException();
    }
  }
  private validatePropertyName(name: string) {
    if (!PlayerPropertyService.PROPERTY_NAME_LIST.includes(name)) {
      throw new BadRequestException();
    }
  }
}
