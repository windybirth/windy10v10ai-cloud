export class GameInfo {
  players: Player[];
  winnerTeamId: number;
  matchId: string;
  gameOption: any;
}

class Player {
  teamId: number;
  steamId: number;
  heroName: string;
  points: number;
}
