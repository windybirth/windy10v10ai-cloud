import { Member } from '../entities/member.entity';

export class MemberDto {
  steamId!: number;
  enable!: boolean;
  expireDateString!: string;

  constructor(member: Member) {
    this.steamId = member.steamId;
    // 有效期次日UTC 00:00后 过期
    const oneDataAgo: Date = new Date();
    oneDataAgo.setDate(oneDataAgo.getDate() - 1);
    this.enable = new Date(member.expireDate) > oneDataAgo;
    this.expireDateString =
      member.expireDate.getUTCFullYear().toString() +
      '-' +
      member.expireDate.getUTCMonth().toString() +
      '-' +
      member.expireDate.getUTCDay().toString();
  }
}
