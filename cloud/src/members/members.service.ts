import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  getFirestore,
} from 'firebase-admin/firestore';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';

import { CreateMemberDto } from './dto/create-member.dto';
import { MemberDto } from './dto/member.dto';
import { MemberOld } from './entities/member.entity';
import { Member } from './entities/members.entity';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private readonly membersRepository: BaseFirestoreRepository<Member>,
  ) {}

  create(member: Member) {
    return this.membersRepository.create(member);
  }
  findOne(steamId: number): Promise<Member> {
    return this.membersRepository.findById(steamId.toString());
  }
  findAll() {
    return this.membersRepository.find();
  }
  //#region firestore access
  // Member converter
  memberConverter = {
    toFirestore(member: MemberOld): DocumentData {
      return {
        steamId: member.steamId,
        expireDate: member.expireDate,
      };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): MemberOld {
      const data = snapshot.data();
      return new MemberOld(
        data.steamId,
        (data.expireDate as Timestamp).toDate(),
      );
    },
  };

  async saveOld(member: MemberOld) {
    const db = getFirestore();
    const memberRef = db
      .collection('members')
      .withConverter(this.memberConverter)
      .doc('' + member.steamId);
    return await memberRef.set(member);
  }

  async findAllOld(): Promise<Member[]> {
    const response: Member[] = [];

    const db = getFirestore();
    const memberSnapshot = await db
      .collection('members')
      .withConverter(this.memberConverter)
      .get();
    memberSnapshot.forEach((doc) => {
      const member = doc.data();
      response.push({ ...member, id: member.steamId.toString() });
    });
    return response;
  }

  // steamIds maxlength 10
  async findBySteamIds(steamIds: number[]): Promise<MemberDto[]> {
    const response: MemberDto[] = [];

    this.membersRepository
      .whereIn('steamId', steamIds)
      .find()
      .then((members) => {
        members.forEach((member) => {
          response.push(new MemberDto(member));
        });
      });
    return response;
  }
  //#endregion

  async createMember(createMemberDto: CreateMemberDto) {
    const steamId = createMemberDto.steamId;
    // TODO find steam id
    const existMember = await this.findOne(steamId);
    const expireDate = new Date();
    if (
      existMember?.expireDate &&
      existMember.expireDate.getTime() > expireDate.getTime()
    ) {
      expireDate.setTime(existMember.expireDate.getTime());
    }
    // steam id not exist
    expireDate.setUTCDate(
      expireDate.getUTCDate() +
        createMemberDto.month * +process.env.DAYS_PER_MONTH,
    );
    expireDate.setUTCHours(0, 0, 0, 0);
    // TODO steam id exist
    // If expired, set same as new.
    // else month base on last expireDate

    await this.create({ id: steamId.toString(), steamId, expireDate });
    return this.find(steamId);
  }

  async find(steamId: number): Promise<MemberDto> {
    const member = await this.findOne(steamId);
    if (member) {
      return new MemberDto(member);
    } else {
      throw new NotFoundException();
    }
  }

  async migration() {
    const members = await this.findAllOld();
    for (const member of members) {
      await this.create(member);
    }
    return `This action migration members from old data`;
  }
  async createAllOld() {
    const members: MemberOld[] = [];
    // 开发贡献者
    members.push(new MemberOld(136407523));
    members.push(new MemberOld(1194383041));
    members.push(new MemberOld(143575444));
    members.push(new MemberOld(314757913));
    members.push(new MemberOld(385130282));
    members.push(new MemberOld(967052298));
    members.push(new MemberOld(1159610111));
    // 永久会员
    members.push(new MemberOld(136668998));
    members.push(new MemberOld(128984820));
    members.push(new MemberOld(133043280));
    members.push(new MemberOld(124111398));
    members.push(new MemberOld(120921523));
    members.push(new MemberOld(146837505));
    members.push(new MemberOld(136385488));
    members.push(new MemberOld(907056028));
    // 到期
    members.push(new MemberOld(20200801, new Date('2020-08-01T00:00:00Z')));
    members.push(new MemberOld(20201231, new Date('2020-12-31T00:00:00Z')));
    // 未来
    members.push(new MemberOld(20300801, new Date('2030-08-01T00:00:00Z')));
    members.push(new MemberOld(20301231, new Date('2030-12-31T00:00:00Z')));
    for (const member of members) {
      await this.saveOld(member);
    }
    return `This action create test members with init data`;
  }
}
