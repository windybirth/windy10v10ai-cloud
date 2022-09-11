import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';
import * as admin from 'firebase-admin';
import { MemberDto } from './dto/member.dto';

@Injectable()
export class MembersService {
  create(createMemberDto: CreateMemberDto) {
    return 'This action adds a new member';
  }

  saveMember(member: Member): void {
    const db = admin.database();
    console.log('Save member:', member);
    db.ref('members/' + member.steamId).update(member);
  }

  createAll() {
    this.saveMember({
      steamId: 108208968,
      expireDate: new Date('2022-07-20T00:00:00'),
    });
    this.saveMember({
      steamId: 1194383041,
      expireDate: new Date('2022-07-20T00:00:00'),
    });
    return `This action create all members with init data`;
  }

  async findAll(): Promise<MemberDto[]> {
    const db = admin.database();
    const ref = db.ref('members');

    const memberSnapshot = await ref.once('value');
    const response: MemberDto[] = [];

    const oneDataAgo: Date = new Date();
    oneDataAgo.setDate(oneDataAgo.getDate() - 1);
    memberSnapshot.forEach((data) => {
      const value = data.val();
      const steamId = value.steamId;
      // 有效期次日UTC 00:00后 过期
      const enable = new Date(value.expireDate) > oneDataAgo;
      const expireDateString = value.expireDate.split('T')[0];

      response.push({ steamId, enable, expireDateString });
    });
    return response;
  }

  findOne(id: number) {
    return `This action returns a #${id} member`;
  }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} member`;
  // }
}
