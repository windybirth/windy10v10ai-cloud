import * as admin from "firebase-admin";

admin.initializeApp();
// const root = admin.database().ref();

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
export async function getMemberSteamIdAll():Promise<Member[]> {
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
  // 会员
  members.push(new Member(108208968, new Date("2022-07-20T00:00:00")));
  members.push(new Member(107451500, new Date("2022-05-20T00:00:00")));
  members.push(new Member(141315077, new Date("2022-07-20T00:00:00")));
  members.push(new Member(303743871, new Date("2022-05-20T00:00:00")));
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
  // 测试
  members.push(new Member(916506173, new Date("2022-05-01T00:00:00")));
  members.push(new Member(1059791959));
  return members;
}

/**
 * @param {number} steamId
*/
// export function saveMemberSteamId(steamId:number):void {
//   root.set(steamId);
// }

/**
 * 会员
 */
class Member {
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

/**
 * 睡眠
 * @param {number} time
 * @return {Promise<void>}
 */
// function sleep(time:number):Promise<void> {
//   return new Promise((resolve) => setTimeout(resolve, time));
// }
