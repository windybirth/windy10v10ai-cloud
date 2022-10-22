import { ApiProperty } from '@nestjs/swagger';

import { MemberDto } from '../../members/dto/member.dto';
import { Player } from '../../player/entities/player.entity';

export class GameStart {
  @ApiProperty()
  members: MemberDto[];
  @ApiProperty()
  players: Player[];
}
