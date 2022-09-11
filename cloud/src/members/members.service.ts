import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';
import * as admin from 'firebase-admin';

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
    return `This action create all members with init data`;
  }

  findAll() {
    const db = admin.database();
    const ref = db.ref('members');
    return ref.once('value', (v) => {
      console.log(v.val());
    });
    // return `This action returns all members`;
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
