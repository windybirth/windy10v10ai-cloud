import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreatePlayerPropertyDto } from './dto/create-player-property.dto';
import { UpdatePlayerPropertyDto } from './dto/update-player-property.dto';
import { PlayerPropertyService } from './player-property.service';

@ApiTags('PlayerProperty')
@Controller('player-property')
export class PlayerPropertyController {
  constructor(private readonly playerPropertyService: PlayerPropertyService) {}

  @Post()
  create(@Body() createPlayerPropertyDto: CreatePlayerPropertyDto) {
    return this.playerPropertyService.create(createPlayerPropertyDto);
  }

  @Get()
  findAll() {
    return this.playerPropertyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playerPropertyService.findOne(id);
  }

  @Get('/steamId/:steamId')
  findBySteamId(@Param('steamId') steamId: string) {
    return this.playerPropertyService.findBySteamId(+steamId);
  }

  @Put()
  update(@Body() updatePlayerPropertyDto: UpdatePlayerPropertyDto) {
    return this.playerPropertyService.update(updatePlayerPropertyDto);
  }
}
