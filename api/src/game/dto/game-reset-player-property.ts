import { ApiProperty } from '@nestjs/swagger';

export class GameResetPlayerProperty {
  @ApiProperty()
  steamId: number;
  @ApiProperty()
  useMemberPoint: boolean;
}
