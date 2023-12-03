import { Collection } from 'fireorm';

@Collection()
export class Member {
  id: string;
  steamId!: number;
  expireDate!: Date;
  // 最近一次签到时间
  lastDailyDate?: Date;
}
