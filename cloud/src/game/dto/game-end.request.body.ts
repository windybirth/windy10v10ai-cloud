import { ApiProperty } from '@nestjs/swagger';

class Player {
  @ApiProperty()
  teamId: number;
  @ApiProperty()
  steamId: number;
  @ApiProperty()
  heroName: string;
  @ApiProperty()
  points: number;
}

export class GameInfo {
  @ApiProperty({ type: [Player] })
  players: Player[];
  @ApiProperty()
  winnerTeamId: number;
  @ApiProperty()
  matchId: string;
  @ApiProperty()
  gameOption: any;
}
