import { ApiProperty } from '@nestjs/swagger';

import { Player } from '../entities/player.entity';

export class PlayerDto extends Player {
  @ApiProperty()
  seasonLevel: number;
  @ApiProperty()
  seasonCurrrentLevelPoint: number;
  @ApiProperty()
  seasonNextLevelPoint: number;
  @ApiProperty()
  memberLevel: number;
  @ApiProperty()
  memberCurrentLevelPoint: number;
  @ApiProperty()
  memberNextLevelPoint: number;
}
