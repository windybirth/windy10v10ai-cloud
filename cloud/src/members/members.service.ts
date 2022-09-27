import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  getFirestore,
} from 'firebase-admin/firestore';

import { CreateMemberDto } from './dto/create-member.dto';
import { MemberDto } from './dto/member.dto';
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

  async save(member: Member) {
    const db = getFirestore();
    const memberRef = db
      .collection('members')
      .withConverter(this.memberConverter)
      .doc('' + member.steamId);
    return await memberRef.set(member);
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

  async findAll(): Promise<MemberDto[]> {
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

  // steamIds maxlength 10
  async findBySteamIds(steamIds: number[]): Promise<MemberDto[]> {
    const response: MemberDto[] = [];

    const db = getFirestore();
    const memberSnapshot = await db
      .collection('members')
      .where('steamId', 'in', steamIds)
      .withConverter(this.memberConverter)
      .get();
    memberSnapshot.forEach((doc) => {
      const member = doc.data();
      response.push(new MemberDto(member));
    });
    return response;
  }
  //#endregion

  async create(createMemberDto: CreateMemberDto) {
    const steamId = createMemberDto.steamId;
    // TODO find steam id
    // steam id not exist
    const expireDate = new Date();
    expireDate.setUTCDate(
      expireDate.getUTCDate() +
        createMemberDto.month * +process.env.DAYS_PER_MONTH,
    );
    expireDate.setUTCHours(0, 0, 0, 0);
    // TODO steam id exist
    // If expired, set same as new.
    // else month base on last expireDate

    await this.save({ steamId, expireDate });
    return this.findOne(steamId);
  }

  async createAll() {
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
    members.push(new Member(20200801, new Date('2020-08-01T00:00:00Z')));
    members.push(new Member(20201231, new Date('2020-12-31T00:00:00Z')));
    // 未来
    members.push(new Member(20300801, new Date('2030-08-01T00:00:00Z')));
    members.push(new Member(20301231, new Date('2030-08-01T00:00:00Z')));
    for (const member of members) {
      await this.save(member);
    }
    return `This action create test members with init data`;
  }

  // async findAll(): Promise<MemberDto[]> {
  //   const db = database();
  //   const ref = db.ref('members');

  //   const memberSnapshot = await ref.once('value');
  //   const response: MemberDto[] = [];

  //   const oneDataAgo: Date = new Date();
  //   oneDataAgo.setDate(oneDataAgo.getDate() - 1);
  //   memberSnapshot.forEach((data) => {
  //     const value = data.val();
  //     const steamId = value.steamId;
  //     const expireDate = new Date(value.expireDate);
  //     const member: Member = { steamId, expireDate };
  //     response.push(new MemberDto(member));
  //   });

  //   return response;
  // }
}
