import { Injectable, NotFoundException } from '@nestjs/common';
import { database } from 'firebase-admin';
import { Timestamp, getFirestore } from 'firebase-admin/firestore';
import { NotFoundError } from 'rxjs';

import { CreateMemberDto } from './dto/create-member.dto';
import { MemberDto } from './dto/member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';

@Injectable()
export class MembersService {
  // Firestore data converter
  //#region firestore db access
  async save(member: Member): Promise<void> {
    const db = getFirestore();
    const memberRef = db.collection('members').doc('' + member.steamId);
    await memberRef.set({
      steamId: member.steamId,
      expireDate: member.expireDate,
    });
  }
  async findOne(steamId: number): Promise<MemberDto> {
    const db = getFirestore();
    const memberRef = db.collection('members').doc('' + steamId);
    const doc = await memberRef.get();
    if (doc.exists) {
      const data = doc.data();
      return new MemberDto(
        new Member(data.steamId, (data.expireDate as Timestamp).toDate()),
      );
    } else {
      throw new NotFoundException();
    }
  }
  //#endregion

  async findAllFirebase(): Promise<MemberDto[]> {
    const response: MemberDto[] = [];

    const db = getFirestore();
    const memberRef = db.collection('members');
    const snapshot = await memberRef.get();
    snapshot.forEach((doc) => {
      const data = doc.data();
      response.push(
        new MemberDto(
          new Member(data.steamId, (data.expireDate as Timestamp).toDate()),
        ),
      );
    });
    return response;
  }

  create(createMemberDto: CreateMemberDto) {
    // FIXME: move 31 to prop file
    const daysPerMonth = 31;
    const steamId = createMemberDto.steamId;
    // TODO find steam id
    // steam id not exist
    const expireDate = new Date();
    expireDate.setUTCDate(
      expireDate.getUTCDate() + createMemberDto.month * daysPerMonth,
    );
    expireDate.setUTCHours(0, 0, 0, 0);
    // TODO steam id exist
    // If expired, set same as new.
    // else month base on last expireDate

    this.save({ steamId, expireDate });
    return 'This action adds a new member';
  }

  async migration() {
    const realtimedb = database();
    const ref = realtimedb.ref('members');

    const memberSnapshot = await ref.once('value');

    const members: Member[] = [];
    memberSnapshot.forEach((data) => {
      const value = data.val();
      const steamId = value.steamId;
      const expireDate = new Date(value.expireDate);
      const member: Member = { steamId, expireDate };
      members.push(member);
    });
    for (const member of members) {
      this.save(member);
    }

    return 'migration success';
  }

  saveMember(member: Member): void {
    const db = database();
    db.ref('members/' + member.steamId).update(member);
  }

  createAll() {
    const members: Member[] = [];
    // 开发贡献者
    members.push(new Member(136407523));
    members.push(new Member(1194383041));
    members.push(new Member(143575444));
    members.push(new Member(314757913));
    members.push(new Member(385130282));
    members.push(new Member(967052298));
    members.push(new Member(1159610111));
    // 永久会员
    members.push(new Member(136668998));
    members.push(new Member(128984820));
    members.push(new Member(133043280));
    members.push(new Member(124111398));
    members.push(new Member(120921523));
    members.push(new Member(146837505));
    members.push(new Member(136385488));
    members.push(new Member(907056028));
    // 会员
    members.push(new Member(108208968, new Date('2022-07-20T00:00:00')));
    members.push(new Member(107451500, new Date('2022-05-20T00:00:00')));
    members.push(new Member(141315077, new Date('2022-10-05T00:00:00')));
    members.push(new Member(117417953, new Date('2023-04-20T00:00:00')));
    members.push(new Member(319701690, new Date('2022-05-20T00:00:00')));
    members.push(new Member(142964279, new Date('2022-07-20T00:00:00')));
    members.push(new Member(125049949, new Date('2022-06-20T00:00:00')));
    members.push(new Member(150252080, new Date('2025-04-20T00:00:00')));
    members.push(new Member(355472172, new Date('2022-05-23T00:00:00')));
    members.push(new Member(445801587, new Date('2022-05-23T00:00:00')));
    members.push(new Member(308320923, new Date('2022-05-23T00:00:00')));
    members.push(new Member(190540884, new Date('2022-05-24T00:00:00')));
    members.push(new Member(1009673688, new Date('2022-05-24T00:00:00')));
    // patreon
    members.push(new Member(67723423, new Date('2022-10-01T00:00:00')));
    members.push(new Member(86539525, new Date('2022-10-01T00:00:00')));
    // 到期
    members.push(new Member(1318433532, new Date('2022-08-31T00:00:00')));
    // 测试
    members.push(new Member(916506173, new Date('2022-08-01T00:00:00')));
    members.forEach((member) => {
      this.saveMember(member);
    });
    return `This action create all members with init data`;
  }

  async findAll(): Promise<MemberDto[]> {
    const db = database();
    const ref = db.ref('members');

    const memberSnapshot = await ref.once('value');
    const response: MemberDto[] = [];

    const oneDataAgo: Date = new Date();
    oneDataAgo.setDate(oneDataAgo.getDate() - 1);
    memberSnapshot.forEach((data) => {
      const value = data.val();
      const steamId = value.steamId;
      const expireDate = new Date(value.expireDate);
      const member: Member = { steamId, expireDate };
      response.push(new MemberDto(member));
    });

    return response;
  }

  async findByIds(steamId: number[]): Promise<MemberDto[]> {
    const memberList: MemberDto[] = [];

    for (const id of steamId) {
      await database()
        .ref('members/' + `${id}`)
        .once('value')
        .then(function (snapshot) {
          const value = snapshot.val();
          if (value) {
            const member: Member = {
              steamId: value.steamId,
              expireDate: new Date(value.expireDate),
            };
            memberList.push(new MemberDto(member));
          }
        });
    }
    // 参考
    // // Find all dinosaurs whose height is exactly 25 meters.
    // const refequalTo = await database().ref('members');
    // refequalTo.orderByChild('steamId').equalTo(ids[0]).once('value', function (snapshot) {
    //   const newPost = snapshot.val();
    //   console.log('newPost: ' + snapshot.key);
    //   console.log('steamId: ' + newPost.steamId);
    //   console.log('expireDateString ' + newPost.expireDateString);
    // });
    return memberList;
  }

  // {"steamId":123123123,"expireDate":"2022-12-02T00:00:00.000Z"}
  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} member`;
  // }
}
