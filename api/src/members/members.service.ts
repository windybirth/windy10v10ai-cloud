import { Injectable, NotFoundException } from '@nestjs/common';
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

  findOne(steamId: number): Promise<Member> {
    return this.membersRepository.findById(steamId.toString());
  }

  // steamIds maxlength 10
  async findBySteamIds(steamIds: number[]): Promise<MemberDto[]> {
    const response: MemberDto[] = [];

    await this.membersRepository
      .whereIn('steamId', steamIds)
      .find()
      .then((members) => {
        members.forEach((member) => {
          response.push(new MemberDto(member));
        });
      });
    // FIXME remove after 2nd anniversary
    // if date from 2022-12-03 to 2022-12-05
    const fromDate = new Date();
    fromDate.setUTCFullYear(2022, 11, 3);
    fromDate.setUTCHours(0, 0, 0, 0);
    const toDate = new Date();
    toDate.setUTCFullYear(2022, 11, 6);
    toDate.setUTCHours(0, 0, 0, 0);
    const now = new Date();
    if (
      now.getTime() > fromDate.getTime() &&
      now.getTime() < toDate.getTime()
    ) {
      steamIds.forEach((steamId) => {
        if (!response.find((member) => member.steamId === steamId)) {
          response.push({
            steamId,
            enable: true,
            expireDateString: '-',
          });
        }
      });
      response.forEach((member) => {
        if (!member.enable) {
          member.enable = true;
          member.expireDateString = '-';
        }
      });
    }
    // FIXME END
    return response;
  }

  async createMember(createMemberDto: CreateMemberDto) {
    const steamId = createMemberDto.steamId;
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

    const member = { id: steamId.toString(), steamId, expireDate };
    if (existMember) {
      await this.membersRepository.update(member);
    } else {
      await this.membersRepository.create(member);
    }
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

  async remove(steamId: number): Promise<string> {
    const member = await this.findOne(steamId);
    if (member) {
      await this.membersRepository.delete(member.id);
      return 'success';
    } else {
      throw new NotFoundException();
    }
  }

  // TODO move to test module
  async initTestData() {
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
      await this.membersRepository.create({
        id: member.steamId.toString(),
        ...member,
      });
    }
    return `This action create test members with init data`;
  }
}
