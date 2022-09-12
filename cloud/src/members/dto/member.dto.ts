import { PartialType } from '@nestjs/mapped-types';
import { CreateMemberDto } from './create-member.dto';

export class MemberDto extends PartialType(CreateMemberDto) {
  steamId!: number;
  enable!: boolean;
  expireDateString!: string;
}
