import { ApiProperty } from '@nestjs/swagger';

import { MemberOld } from '../entities/member.entity';
import { Member } from '../entities/members.entity';

export class MemberDto {
  @ApiProperty()
  steamId!: number;
  @ApiProperty()
  enable!: boolean;
  @ApiProperty()
  expireDateString!: string;

  constructor(member: MemberOld | Member) {
    this.steamId = member.steamId;
    // 有效期次日UTC 00:00后 过期
    const oneDataAgo: Date = new Date();
    oneDataAgo.setDate(oneDataAgo.getDate() - 1);
    this.enable = member.expireDate > oneDataAgo;
    this.expireDateString = member.expireDate.toISOString().split('T')[0];
  }
}
