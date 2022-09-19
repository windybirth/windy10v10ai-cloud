import { Injectable } from '@nestjs/common';
import { database } from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

import { CreateMemberDto } from './dto/create-member.dto';
import { MemberDto } from './dto/member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';

@Injectable()
export class MembersService {
  //#region firestore db access
  async save(member: Member): Promise<void> {
    const db = getFirestore();
    const docRef = db.collection('members').doc();
    await docRef.set({
      steamId: member.steamId,
      expireDate: member.expireDate,
    });
  }
  find(steamId: number): Member {
    const db = getFirestore();
    // TODO https://firebase.google.com/docs/firestore/manage-data/add-data
    return new Member(steamId, new Date());
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
    members.push(new Member(342865365, new Date('2022-10-26T00:00:00')));
    members.push(new Member(379664769, new Date('2022-05-24T00:00:00')));
    members.push(new Member(153272663, new Date('2022-07-26T00:00:00')));
    members.push(new Member(882465781, new Date('2022-05-26T00:00:00')));
    members.push(new Member(360222290, new Date('2023-05-03T00:00:00')));
    members.push(new Member(185047994, new Date('2022-05-29T00:00:00')));
    members.push(new Member(180838006, new Date('2022-05-30T00:00:00')));
    members.push(new Member(874713025, new Date('2022-05-31T00:00:00')));
    members.push(new Member(144800834, new Date('2022-05-31T00:00:00')));
    members.push(new Member(141548767, new Date('2022-06-01T00:00:00')));
    members.push(new Member(180389221, new Date('2022-08-02T00:00:00')));
    members.push(new Member(251171524, new Date('2022-12-02T00:00:00')));
    members.push(new Member(275500980, new Date('2022-06-02T00:00:00')));
    members.push(new Member(235845422, new Date('2022-11-04T00:00:00')));
    members.push(new Member(918581722, new Date('2022-08-03T00:00:00')));
    members.push(new Member(306190449, new Date('2022-06-02T00:00:00')));
    members.push(new Member(179404686, new Date('2022-06-02T00:00:00')));
    members.push(new Member(374719134, new Date('2022-06-02T00:00:00')));
    members.push(new Member(864363572, new Date('2022-06-04T00:00:00')));
    members.push(new Member(136940046, new Date('2022-06-05T00:00:00')));
    members.push(new Member(208461180, new Date('2023-05-12T00:00:00')));
    members.push(new Member(1062548803, new Date('2022-06-08T00:00:00')));
    members.push(new Member(1272840276, new Date('2022-11-10T00:00:00')));
    members.push(new Member(295998482, new Date('2022-06-11T00:00:00')));
    members.push(new Member(367303307, new Date('2022-06-17T00:00:00')));
    members.push(new Member(233698578, new Date('2022-07-05T00:00:00')));
    members.push(new Member(444831658, new Date('2022-12-07T00:00:00')));
    members.push(new Member(445619710, new Date('2022-09-06T00:00:00')));
    members.push(new Member(136595172, new Date('2022-07-06T00:00:00')));
    members.push(new Member(314320021, new Date('2022-07-07T00:00:00')));
    members.push(new Member(131495959, new Date('2022-10-07T00:00:00')));
    members.push(new Member(924336952, new Date('2022-07-08T00:00:00')));
    members.push(new Member(187818172, new Date('2022-07-08T00:00:00')));
    members.push(new Member(162679730, new Date('2022-07-08T00:00:00')));
    members.push(new Member(327729726, new Date('2022-07-09T00:00:00')));
    members.push(new Member(228819762, new Date('2022-07-11T00:00:00')));
    members.push(new Member(466149396, new Date('2022-07-11T00:00:00')));
    members.push(new Member(264142252, new Date('2022-09-12T00:00:00')));
    members.push(new Member(1274001179, new Date('2022-07-12T00:00:00')));
    members.push(new Member(360079868, new Date('2022-07-13T00:00:00')));
    members.push(new Member(149196343, new Date('2022-07-15T00:00:00')));
    members.push(new Member(1094514134, new Date('2022-07-16T00:00:00')));
    members.push(new Member(1082599576, new Date('2022-12-18T00:00:00')));
    members.push(new Member(231865537, new Date('2022-07-17T00:00:00')));
    members.push(new Member(363005190, new Date('2022-07-17T00:00:00')));
    members.push(new Member(1170873561, new Date('2022-07-19T00:00:00')));
    members.push(new Member(136341710, new Date('2022-07-19T00:00:00')));
    members.push(new Member(136842497, new Date('2022-07-21T00:00:00')));
    members.push(new Member(59663613, new Date('2022-10-06T00:00:00')));
    members.push(new Member(138652140, new Date('2022-07-23T00:00:00')));
    members.push(new Member(228803327, new Date('2022-07-26T00:00:00')));
    members.push(new Member(98162617, new Date('2022-07-30T00:00:00')));
    members.push(new Member(107625818, new Date('2023-01-04T00:00:00')));
    members.push(new Member(424394323, new Date('2023-01-05T00:00:00')));
    members.push(new Member(110663197, new Date('2022-08-07T00:00:00')));
    members.push(new Member(215738002, new Date('2022-10-03T00:00:00')));
    members.push(new Member(294278887, new Date('2022-10-13T00:00:00')));
    members.push(new Member(322271699, new Date('2022-10-13T00:00:00')));
    members.push(new Member(171217775, new Date('2023-07-24T00:00:00')));
    members.push(new Member(1166147496, new Date('2022-10-20T00:00:00')));
    members.push(new Member(176061240, new Date('2022-10-21T00:00:00')));
    members.push(new Member(127685098, new Date('2022-08-22T00:00:00')));
    members.push(new Member(213875775, new Date('2022-08-24T00:00:00')));
    members.push(new Member(226209386, new Date('2022-08-24T00:00:00')));
    members.push(new Member(143837979, new Date('2022-08-25T00:00:00')));
    members.push(new Member(241893614, new Date('2022-08-25T00:00:00')));
    members.push(new Member(156694017, new Date('2022-10-25T00:00:00')));
    members.push(new Member(213346065, new Date('2023-01-31T00:00:00')));
    members.push(new Member(208755952, new Date('2022-08-26T00:00:00')));
    members.push(new Member(174229384, new Date('2023-01-31T00:00:00')));
    members.push(new Member(129972639, new Date('2022-08-28T00:00:00')));
    members.push(new Member(241879058, new Date('2022-08-28T00:00:00')));
    members.push(new Member(140769251, new Date('2022-08-30T00:00:00')));
    members.push(new Member(186876312, new Date('2022-08-31T00:00:00')));
    members.push(new Member(121514138, new Date('2022-09-01T00:00:00')));
    members.push(new Member(849959529, new Date('2022-09-03T00:00:00')));
    members.push(new Member(148269987, new Date('2022-11-04T00:00:00')));
    members.push(new Member(295200117, new Date('2025-08-25T00:00:00')));
    members.push(new Member(139377303, new Date('2022-09-05T00:00:00')));
    members.push(new Member(129797279, new Date('2023-01-31T00:00:00')));
    members.push(new Member(404654823, new Date('2022-09-08T00:00:00')));
    members.push(new Member(318935018, new Date('2022-10-31T00:00:00')));
    members.push(new Member(86767074, new Date('2022-09-09T00:00:00')));
    members.push(new Member(73059502, new Date('2022-11-11T00:00:00')));
    members.push(new Member(141805019, new Date('2022-09-10T00:00:00')));
    members.push(new Member(140763807, new Date('2022-09-10T00:00:00')));
    members.push(new Member(84800173, new Date('2023-02-14T00:00:00')));
    members.push(new Member(1026882748, new Date('2022-09-12T00:00:00')));
    members.push(new Member(193859368, new Date('2022-09-12T00:00:00')));
    members.push(new Member(115909929, new Date('2023-03-17T00:00:00')));
    members.push(new Member(323139801, new Date('2022-09-13T00:00:00')));
    members.push(new Member(322229870, new Date('2022-10-14T00:00:00')));
    members.push(new Member(99825061, new Date('2022-09-13T00:00:00')));
    members.push(new Member(70200897, new Date('2022-09-13T00:00:00')));
    members.push(new Member(314643375, new Date('2023-02-15T00:00:00')));
    members.push(new Member(332384968, new Date('2022-09-15T00:00:00')));
    members.push(new Member(338188516, new Date('2022-09-15T00:00:00')));
    members.push(new Member(109270703, new Date('2022-09-15T00:00:00')));
    members.push(new Member(118324486, new Date('2022-09-16T00:00:00')));
    members.push(new Member(840087655, new Date('2022-09-17T00:00:00')));
    members.push(new Member(354325944, new Date('2022-12-18T00:00:00')));
    members.push(new Member(86802334, new Date('2022-12-18T00:00:00')));
    members.push(new Member(295612065, new Date('2022-09-18T00:00:00')));
    members.push(new Member(138189607, new Date('2022-09-18T00:00:00')));
    members.push(new Member(292827485, new Date('2023-09-19T00:00:00')));
    members.push(new Member(955766569, new Date('2023-02-22T00:00:00')));
    members.push(new Member(121577760, new Date('2022-09-20T00:00:00')));
    members.push(new Member(139073897, new Date('2023-03-22T00:00:00')));
    members.push(new Member(317958553, new Date('2022-09-21T00:00:00')));
    members.push(new Member(245559423, new Date('2022-09-21T00:00:00')));
    members.push(new Member(174352044, new Date('2022-11-22T00:00:00')));
    members.push(new Member(971109837, new Date('2022-09-21T00:00:00')));
    members.push(new Member(436523601, new Date('2022-09-21T00:00:00')));
    members.push(new Member(368432773, new Date('2022-09-22T00:00:00')));
    members.push(new Member(1033313629, new Date('2023-02-24T00:00:00')));
    members.push(new Member(129745055, new Date('2022-09-22T00:00:00')));
    members.push(new Member(889187695, new Date('2022-09-25T00:00:00')));
    members.push(new Member(430821592, new Date('2022-09-25T00:00:00')));
    members.push(new Member(151516554, new Date('2022-09-26T00:00:00')));
    members.push(new Member(293124651, new Date('2022-09-26T00:00:00')));
    members.push(new Member(330994098, new Date('2023-03-31T00:00:00')));
    members.push(new Member(141358534, new Date('2022-09-27T00:00:00')));
    members.push(new Member(156268618, new Date('2022-09-27T00:00:00')));
    members.push(new Member(136373823, new Date('2022-09-28T00:00:00')));
    members.push(new Member(393340089, new Date('2022-09-28T00:00:00')));
    members.push(new Member(125335441, new Date('2022-09-28T00:00:00')));
    members.push(new Member(353885092, new Date('2022-10-28T00:00:00')));
    members.push(new Member(386472436, new Date('2022-09-29T00:00:00')));
    members.push(new Member(303743871, new Date('2022-09-29T00:00:00')));
    members.push(new Member(407346170, new Date('2022-09-29T00:00:00')));
    members.push(new Member(111889821, new Date('2022-09-30T00:00:00')));
    members.push(new Member(435333920, new Date('2023-03-04T00:00:00')));
    members.push(new Member(132588126, new Date('2022-12-01T00:00:00')));
    members.push(new Member(186715813, new Date('2022-09-30T00:00:00')));
    members.push(new Member(1037402422, new Date('2022-09-30T00:00:00')));
    members.push(new Member(160996305, new Date('2022-09-30T00:00:00')));
    members.push(new Member(342049002, new Date('2022-10-02T00:00:00')));
    members.push(new Member(59388035, new Date('2022-12-02T00:00:00')));
    members.push(new Member(1030644778, new Date('2022-10-04T00:00:00')));
    members.push(new Member(139467272, new Date('2022-10-04T00:00:00')));
    members.push(new Member(225169923, new Date('2022-10-04T00:00:00')));
    members.push(new Member(355022199, new Date('2022-10-04T00:00:00')));
    members.push(new Member(233537853, new Date('2022-12-07T00:00:00')));
    members.push(new Member(136559231, new Date('2022-10-07T00:00:00')));
    members.push(new Member(109567838, new Date('2022-10-07T00:00:00')));
    members.push(new Member(134020001, new Date('2023-09-19T00:00:00')));
    members.push(new Member(231445049, new Date('2023-09-14T00:00:00')));
    members.push(new Member(177921837, new Date('2022-10-07T00:00:00')));
    members.push(new Member(171842580, new Date('2022-10-08T00:00:00')));
    members.push(new Member(329920068, new Date('2022-10-09T00:00:00')));
    members.push(new Member(422435396, new Date('2022-10-10T00:00:00')));
    members.push(new Member(126012640, new Date('2022-10-10T00:00:00')));
    members.push(new Member(303641555, new Date('2022-10-10T00:00:00')));
    members.push(new Member(78534313, new Date('2022-10-11T00:00:00')));
    members.push(new Member(165084964, new Date('2022-10-11T00:00:00')));
    members.push(new Member(283541284, new Date('2022-10-11T00:00:00')));
    members.push(new Member(166176506, new Date('2022-12-12T00:00:00')));
    members.push(new Member(887874899, new Date('2024-10-04T00:00:00')));
    members.push(new Member(142753729, new Date('2022-10-11T00:00:00')));
    members.push(new Member(304433359, new Date('2022-10-11T00:00:00')));
    members.push(new Member(140354255, new Date('2022-10-11T00:00:00')));
    members.push(new Member(409974245, new Date('2022-10-11T00:00:00')));
    members.push(new Member(150133273, new Date('2022-10-11T00:00:00')));
    members.push(new Member(118184749, new Date('2022-10-11T00:00:00')));
    members.push(new Member(234904622, new Date('2022-10-11T00:00:00')));
    members.push(new Member(105991014, new Date('2022-10-11T00:00:00')));
    members.push(new Member(217109099, new Date('2022-10-11T00:00:00')));
    members.push(new Member(166658031, new Date('2023-03-15T00:00:00')));
    members.push(new Member(206351703, new Date('2022-10-11T00:00:00')));
    members.push(new Member(101812265, new Date('2022-10-11T00:00:00')));
    members.push(new Member(487120656, new Date('2022-10-12T00:00:00')));
    members.push(new Member(310735421, new Date('2023-09-18T00:00:00')));
    members.push(new Member(139693013, new Date('2022-12-13T00:00:00')));
    members.push(new Member(139345058, new Date('2022-12-13T00:00:00')));
    members.push(new Member(153632407, new Date('2023-12-06T00:00:00')));
    members.push(new Member(908271686, new Date('2023-09-11T00:00:00')));
    members.push(new Member(932992019, new Date('2022-10-12T00:00:00')));
    members.push(new Member(147443347, new Date('2022-10-12T00:00:00')));
    members.push(new Member(112073229, new Date('2023-03-17T00:00:00')));
    members.push(new Member(127562876, new Date('2022-10-12T00:00:00')));
    members.push(new Member(180087758, new Date('2022-10-12T00:00:00')));
    members.push(new Member(219219483, new Date('2022-12-13T00:00:00')));
    members.push(new Member(140880944, new Date('2022-10-12T00:00:00')));
    members.push(new Member(1034344949, new Date('2022-10-12T00:00:00')));
    members.push(new Member(356899063, new Date('2022-10-12T00:00:00')));
    members.push(new Member(837505882, new Date('2023-03-16T00:00:00')));
    members.push(new Member(167246975, new Date('2022-10-13T00:00:00')));
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

  findOne(id: number) {
    return `This action returns a #${id} member`;
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
