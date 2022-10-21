import { Collection } from 'fireorm';

@Collection()
export class Player {
  id: string;
  matchCount: number;
  winCount: number;
  disconnectCount: number;
  seasonPointUsable: number;
  seasonPointTotal: number;
  chargePointUsable: number;
  chargePointTotal: number;
  // 最近一次游戏开始时间
  lastMatchTime: Date;
}
