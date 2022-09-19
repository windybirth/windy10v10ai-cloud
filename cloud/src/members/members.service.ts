import { Injectable, NotFoundException } from '@nestjs/common';
import { database } from 'firebase-admin';
import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  getFirestore,
} from 'firebase-admin/firestore';

import { CreateMemberDto } from './dto/create-member.dto';
import { MemberDto } from './dto/member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';

@Injectable()
export class MembersService {
  //#region firestore db access

  // Firestore data converter
  memberConverter = {
    toFirestore(member: Member): DocumentData {
      return {
        steamId: member.steamId,
        expireDate: member.expireDate,
      };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): Member {
      const data = snapshot.data();
      return new Member(data.steamId, (data.expireDate as Timestamp).toDate());
    },
  };

  async save(member: Member): Promise<void> {
    const db = getFirestore();
    const memberRef = db
      .collection('members')
      .withConverter(this.memberConverter)
      .doc('' + member.steamId);
    await memberRef.set(member);
  }

  async findOne(steamId: number): Promise<MemberDto> {
    const db = getFirestore();
    const memberSnapshot = await db
      .collection('members')
      .withConverter(this.memberConverter)
      .doc('' + steamId)
      .get();
    const member = memberSnapshot.data();
    if (member) {
      return new MemberDto(member);
    } else {
      throw new NotFoundException();
    }
  }

  async findAllFirebase(): Promise<MemberDto[]> {
    const response: MemberDto[] = [];

    const db = getFirestore();
    const memberSnapshot = await db
      .collection('members')
      .withConverter(this.memberConverter)
      .get();
    memberSnapshot.forEach((doc) => {
      const member = doc.data();
      response.push(new MemberDto(member));
    });
    return response;
  }

  //#endregion

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
    // 到期
    members.push(new Member(1318433532, new Date('2022-08-31T00:00:00')));
    // 未来
    members.push(new Member(916506173, new Date('2025-08-01T00:00:00')));
    members.forEach((member) => {
      this.save(member);
    });
    return `This action create test members with init data`;
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

  update(id: number, updateMemberDto: UpdateMemberDto) {
    // TODO
    return `This action updates a #${id} member with ${updateMemberDto.month}`;
  }
}
