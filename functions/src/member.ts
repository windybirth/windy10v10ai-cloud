import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.database();


/**
 * @return {number[]}所有会员SteamID
 */
export function getMembersSteamId():number[] {
  return [
    // 开发贡献者
    136407523, 1194383041, 143575444, 314757913, 385130282,
    // 初始会员
    108208968,
    128984820,
    136668998,
    107451500,
    141315077,
    303743871,
    117417953,
    319701690,
    142964279,
    125049949,
    353885092,
    150252080,
    120921523,
    355472172,
    445801587,
    308320923,
    176061240,
    190540884,
    1009673688,
    342865365,
    379664769,
    // 测试
    916506173, // Arararara
    1059791959, // rerorerore
  ];
}

/**
 * @return {number[]}所有会员SteamID
 */
export async function getMemberSteamIdAll():Promise<MemberInfo[]> {
  const members : MemberInfo[] = [];
  // 开发贡献者
  members.push(new MemberInfo(136407523));
  members.push(new MemberInfo(1194383041));
  members.push(new MemberInfo(143575444));
  members.push(new MemberInfo(314757913));
  members.push(new MemberInfo(385130282));
  // 永久会员
  members.push(new MemberInfo(136668998));
  members.push(new MemberInfo(128984820));
  members.push(new MemberInfo(133043280));
  // 会员
  members.push(new MemberInfo(108208968, new Date("2022-07-20T00:00:00")));
  members.push(new MemberInfo(107451500, new Date("2022-05-20T00:00:00")));
  members.push(new MemberInfo(141315077, new Date("2022-07-20T00:00:00")));
  members.push(new MemberInfo(303743871, new Date("2022-08-20T00:00:00")));
  members.push(new MemberInfo(117417953, new Date("2023-04-20T00:00:00")));
  members.push(new MemberInfo(319701690, new Date("2022-05-20T00:00:00")));
  members.push(new MemberInfo(142964279, new Date("2022-07-20T00:00:00")));
  members.push(new MemberInfo(125049949, new Date("2022-05-20T00:00:00")));
  members.push(new MemberInfo(353885092, new Date("2022-07-20T00:00:00")));
  members.push(new MemberInfo(150252080, new Date("2025-04-20T00:00:00")));
  members.push(new MemberInfo(120921523, new Date("2022-05-20T00:00:00")));
  members.push(new MemberInfo(355472172, new Date("2022-05-23T00:00:00")));
  members.push(new MemberInfo(445801587, new Date("2022-05-23T00:00:00")));
  members.push(new MemberInfo(308320923, new Date("2022-05-23T00:00:00")));
  members.push(new MemberInfo(176061240, new Date("2022-05-24T00:00:00")));
  members.push(new MemberInfo(190540884, new Date("2022-05-24T00:00:00")));
  members.push(new MemberInfo(1009673688, new Date("2022-05-24T00:00:00")));
  members.push(new MemberInfo(342865365, new Date("2022-10-26T00:00:00")));
  members.push(new MemberInfo(379664769, new Date("2022-05-24T00:00:00")));
  members.push(new MemberInfo(153272663, new Date("2022-07-26T00:00:00")));
  members.push(new MemberInfo(444831658, new Date("2022-05-26T00:00:00")));
  members.push(new MemberInfo(882465781, new Date("2022-05-26T00:00:00")));
  members.push(new MemberInfo(342049002, new Date("2022-05-26T00:00:00")));
  members.push(new MemberInfo(360222290, new Date("2023-05-03T00:00:00")));
  members.push(new MemberInfo(86802334, new Date("2022-07-28T00:00:00")));
  members.push(new MemberInfo(185047994, new Date("2022-05-29T00:00:00")));
  members.push(new MemberInfo(231445049, new Date("2022-05-29T00:00:00")));
  members.push(new MemberInfo(180838006, new Date("2022-05-30T00:00:00")));
  members.push(new MemberInfo(874713025, new Date("2022-05-31T00:00:00")));
  members.push(new MemberInfo(144800834, new Date("2022-05-31T00:00:00")));
  members.push(new MemberInfo(141548767, new Date("2022-06-01T00:00:00")));
  members.push(new MemberInfo(338188516, new Date("2022-06-01T00:00:00")));
  members.push(new MemberInfo(121514138, new Date("2022-06-01T00:00:00")));
  members.push(new MemberInfo(180389221, new Date("2022-08-02T00:00:00")));
  members.push(new MemberInfo(251171524, new Date("2022-12-02T00:00:00")));
  members.push(new MemberInfo(215738002, new Date("2022-06-02T00:00:00")));
  members.push(new MemberInfo(275500980, new Date("2022-06-02T00:00:00")));
  members.push(new MemberInfo(235845422, new Date("2022-11-04T00:00:00")));
  members.push(new MemberInfo(908271686, new Date("2022-06-02T00:00:00")));
  members.push(new MemberInfo(918581722, new Date("2022-08-03T00:00:00")));
  members.push(new MemberInfo(306190449, new Date("2022-06-02T00:00:00")));
  members.push(new MemberInfo(179404686, new Date("2022-06-02T00:00:00")));
  members.push(new MemberInfo(374719134, new Date("2022-06-02T00:00:00")));
  members.push(new MemberInfo(907056028, new Date("2022-11-06T00:00:00")));
  members.push(new MemberInfo(864363572, new Date("2022-06-04T00:00:00")));
  members.push(new MemberInfo(136940046, new Date("2022-06-05T00:00:00")));
  members.push(new MemberInfo(208461180, new Date("2023-05-12T00:00:00")));
  members.push(new MemberInfo(101812265, new Date("2022-06-06T00:00:00")));
  members.push(new MemberInfo(1274001179, new Date("2022-06-07T00:00:00")));
  members.push(new MemberInfo(142753729, new Date("2022-06-07T00:00:00")));
  members.push(new MemberInfo(1062548803, new Date("2022-06-08T00:00:00")));
  members.push(new MemberInfo(1272840276, new Date("2022-11-10T00:00:00")));
  // 测试
  members.push(new MemberInfo(916506173, new Date("2022-06-01T00:00:00")));
  members.push(new MemberInfo(1059791959));
  return members;
}

/**
 * @param {number} steamId
*/
export function initMemberSteamId():void {
  const members : Member[] = [];
  // 开发贡献者
  members.push(new Member(136407523));
  members.push(new Member(1194383041));
  members.push(new Member(143575444));
  members.push(new Member(314757913));
  members.push(new Member(385130282));
  // 永久会员
  members.push(new Member(136668998));
  members.push(new Member(128984820));
  members.push(new Member(133043280));
  // 会员
  members.push(new Member(108208968, new Date("2022-07-20T00:00:00")));
  members.push(new Member(107451500, new Date("2022-05-20T00:00:00")));
  members.push(new Member(141315077, new Date("2022-07-20T00:00:00")));
  members.push(new Member(303743871, new Date("2022-08-20T00:00:00")));
  members.push(new Member(117417953, new Date("2023-04-20T00:00:00")));
  members.push(new Member(319701690, new Date("2022-05-20T00:00:00")));
  members.push(new Member(142964279, new Date("2022-07-20T00:00:00")));
  members.push(new Member(125049949, new Date("2022-05-20T00:00:00")));
  members.push(new Member(353885092, new Date("2022-07-20T00:00:00")));
  members.push(new Member(150252080, new Date("2025-04-20T00:00:00")));
  members.push(new Member(120921523, new Date("2022-05-20T00:00:00")));
  members.push(new Member(355472172, new Date("2022-05-23T00:00:00")));
  members.push(new Member(445801587, new Date("2022-05-23T00:00:00")));
  members.push(new Member(308320923, new Date("2022-05-23T00:00:00")));
  members.push(new Member(176061240, new Date("2022-05-24T00:00:00")));
  members.push(new Member(190540884, new Date("2022-05-24T00:00:00")));
  members.push(new Member(1009673688, new Date("2022-05-24T00:00:00")));
  members.push(new Member(342865365, new Date("2022-10-26T00:00:00")));
  members.push(new Member(379664769, new Date("2022-05-24T00:00:00")));
  members.push(new Member(153272663, new Date("2022-07-26T00:00:00")));
  members.push(new Member(444831658, new Date("2022-05-26T00:00:00")));
  members.push(new Member(882465781, new Date("2022-05-26T00:00:00")));
  members.push(new Member(342049002, new Date("2022-05-26T00:00:00")));
  members.push(new Member(360222290, new Date("2023-05-03T00:00:00")));
  members.push(new Member(86802334, new Date("2022-07-28T00:00:00")));
  members.push(new Member(185047994, new Date("2022-05-29T00:00:00")));
  members.push(new Member(231445049, new Date("2022-05-29T00:00:00")));
  members.push(new Member(180838006, new Date("2022-05-30T00:00:00")));
  members.push(new Member(874713025, new Date("2022-05-31T00:00:00")));
  members.push(new Member(144800834, new Date("2022-05-31T00:00:00")));
  members.push(new Member(141548767, new Date("2022-06-01T00:00:00")));
  members.push(new Member(338188516, new Date("2022-06-01T00:00:00")));
  members.push(new Member(121514138, new Date("2022-06-01T00:00:00")));
  members.push(new Member(180389221, new Date("2022-08-02T00:00:00")));
  members.push(new Member(251171524, new Date("2022-12-02T00:00:00")));
  members.push(new Member(215738002, new Date("2022-06-02T00:00:00")));
  members.push(new Member(275500980, new Date("2022-06-02T00:00:00")));
  members.push(new Member(235845422, new Date("2022-11-04T00:00:00")));
  members.push(new Member(908271686, new Date("2022-06-02T00:00:00")));
  members.push(new Member(918581722, new Date("2022-08-03T00:00:00")));
  members.push(new Member(306190449, new Date("2022-06-02T00:00:00")));
  members.push(new Member(179404686, new Date("2022-06-02T00:00:00")));
  members.push(new Member(374719134, new Date("2022-06-02T00:00:00")));
  members.push(new Member(907056028, new Date("2022-11-06T00:00:00")));
  members.push(new Member(864363572, new Date("2022-06-04T00:00:00")));
  members.push(new Member(136940046, new Date("2022-06-05T00:00:00")));
  members.push(new Member(208461180, new Date("2023-05-12T00:00:00")));
  members.push(new Member(101812265, new Date("2022-06-06T00:00:00")));
  members.push(new Member(1274001179, new Date("2022-06-07T00:00:00")));
  members.push(new Member(142753729, new Date("2022-06-07T00:00:00")));
  members.push(new Member(1062548803, new Date("2022-06-08T00:00:00")));
  members.push(new Member(1272840276, new Date("2022-11-10T00:00:00")));
  // 测试
  members.push(new Member(916506173, new Date("2022-06-01T00:00:00")));
  members.push(new Member(1059791959));
  members.forEach(function(member) {
    saveMember(member);
  });
}

/**
 * @param {number} steamId
 * @param {number} subscribeMonth - 订阅月数
*/
export async function addMemberSteamId(steamId:number, subscribeMonth:number):Promise<void> {
  if (steamId === undefined || subscribeMonth === undefined) {
    return;
  }
  let termDate:Date = new Date();
  const memberExist = await getMember(steamId);
  if (memberExist != null) {
    console.log("Exist member:", memberExist.expireDate);
    if (memberExist.expireDate > new Date()) {
      // 已经订阅过,未过期时，续期
      termDate=memberExist.expireDate;
    }
  }

  termDate.setMonth(termDate.getMonth() + subscribeMonth);
  console.log("Add member:", termDate);
  const member = new Member(steamId, termDate);
  saveMember(member);
}

/**
 * @param {number} steamId
 * @return {Promise<Member[]>}
*/
export async function getMemberSteamId(steamId: number) {
  const memberInfos : MemberInfo[] = [];

  await db.ref("members/" + steamId).on("value", (snapshot) => {
    console.log("Get member:", steamId);
    memberInfos.push(
        new MemberInfo(snapshot.val().steamId, new Date(snapshot.val().expireDate)));
  }, (errorObject) => {
    console.log("The read failed: " + errorObject.name);
  });

  console.log("memberInfos", memberInfos);
  return memberInfos;
}

// eslint-disable-next-line require-jsdoc
function saveMember(member:Member):void {
  console.log("Save member:", member);
  db.ref("members/" + member.steamId).update(member);
}

// eslint-disable-next-line require-jsdoc
async function getMember(steamId:number):Promise<Member|null> {
  let member:Member|null = null;
  await db.ref("members/" + steamId).on("value", (snapshot) => {
    member = new Member(snapshot.val().steamId, new Date(snapshot.val().expireDate));
  }, (errorObject) => {
    console.log("The read failed: " + errorObject.name);
  });
  return member;
}

/**
 * 会员
 */
class Member {
  steamId : number;
  // enable : boolean;
  expireDate : Date;
  /**
   * @param {number} steamId
   * @param {Date} expireDate
   */
  constructor(steamId:number, expireDate?:Date) {
    this.steamId = steamId;
    // if expireDate is not specified, set it to the default value
    this.expireDate = expireDate || new Date("2099-12-31T00:00:00");
  }
}

// eslint-disable-next-line require-jsdoc
class MemberInfo {
  steamId : number;
  enable : boolean;
  expireDateString : string;
  /**
   * @param {number} steamId
   * @param {Date} expireDate
   */
  constructor(steamId:number, expireDate?:Date) {
    this.steamId = steamId;
    // if expireDate is not specified, set it to the default value
    expireDate = expireDate || new Date("2099-12-31T00:00:00");
    const oneDataAgo:Date = new Date();
    oneDataAgo.setDate(oneDataAgo.getDate() - 1);
    this.enable = expireDate > oneDataAgo;
    this.expireDateString = expireDate.toISOString().split("T")[0];
  }
}
