import { ApiProperty } from '@nestjs/swagger';

export class Player {
  @ApiProperty()
  teamId: number;
  @ApiProperty()
  steamId: number;
  @ApiProperty()
  heroName: string;
  @ApiProperty()
  points: number;
  @ApiProperty()
  isDisconnect: boolean;
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
