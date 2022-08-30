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
  members.push(new MemberInfo(124111398));
  members.push(new MemberInfo(120921523));
  members.push(new MemberInfo(146837505));
  members.push(new MemberInfo(136385488));
  members.push(new MemberInfo(907056028));
  // 会员
  members.push(new MemberInfo(108208968, new Date("2022-07-20T00:00:00")));
  members.push(new MemberInfo(107451500, new Date("2022-05-20T00:00:00")));
  members.push(new MemberInfo(141315077, new Date("2022-07-20T00:00:00")));
  members.push(new MemberInfo(117417953, new Date("2023-04-20T00:00:00")));
  members.push(new MemberInfo(319701690, new Date("2022-05-20T00:00:00")));
  members.push(new MemberInfo(142964279, new Date("2022-07-20T00:00:00")));
  members.push(new MemberInfo(125049949, new Date("2022-06-20T00:00:00")));
  members.push(new MemberInfo(150252080, new Date("2025-04-20T00:00:00")));
  members.push(new MemberInfo(355472172, new Date("2022-05-23T00:00:00")));
  members.push(new MemberInfo(445801587, new Date("2022-05-23T00:00:00")));
  members.push(new MemberInfo(308320923, new Date("2022-05-23T00:00:00")));
  members.push(new MemberInfo(190540884, new Date("2022-05-24T00:00:00")));
  members.push(new MemberInfo(1009673688, new Date("2022-05-24T00:00:00")));
  members.push(new MemberInfo(342865365, new Date("2022-10-26T00:00:00")));
  members.push(new MemberInfo(379664769, new Date("2022-05-24T00:00:00")));
  members.push(new MemberInfo(153272663, new Date("2022-07-26T00:00:00")));
  members.push(new MemberInfo(882465781, new Date("2022-05-26T00:00:00")));
  members.push(new MemberInfo(360222290, new Date("2023-05-03T00:00:00")));
  members.push(new MemberInfo(185047994, new Date("2022-05-29T00:00:00")));
  members.push(new MemberInfo(180838006, new Date("2022-05-30T00:00:00")));
  members.push(new MemberInfo(874713025, new Date("2022-05-31T00:00:00")));
  members.push(new MemberInfo(144800834, new Date("2022-05-31T00:00:00")));
  members.push(new MemberInfo(141548767, new Date("2022-06-01T00:00:00")));
  members.push(new MemberInfo(180389221, new Date("2022-08-02T00:00:00")));
  members.push(new MemberInfo(251171524, new Date("2022-12-02T00:00:00")));
  members.push(new MemberInfo(275500980, new Date("2022-06-02T00:00:00")));
  members.push(new MemberInfo(235845422, new Date("2022-11-04T00:00:00")));
  members.push(new MemberInfo(908271686, new Date("2022-06-02T00:00:00")));
  members.push(new MemberInfo(918581722, new Date("2022-08-03T00:00:00")));
  members.push(new MemberInfo(306190449, new Date("2022-06-02T00:00:00")));
  members.push(new MemberInfo(179404686, new Date("2022-06-02T00:00:00")));
  members.push(new MemberInfo(374719134, new Date("2022-06-02T00:00:00")));
  members.push(new MemberInfo(864363572, new Date("2022-06-04T00:00:00")));
  members.push(new MemberInfo(136940046, new Date("2022-06-05T00:00:00")));
  members.push(new MemberInfo(208461180, new Date("2023-05-12T00:00:00")));
  members.push(new MemberInfo(101812265, new Date("2022-06-06T00:00:00")));
  members.push(new MemberInfo(142753729, new Date("2022-06-07T00:00:00")));
  members.push(new MemberInfo(1062548803, new Date("2022-06-08T00:00:00")));
  members.push(new MemberInfo(1272840276, new Date("2022-11-10T00:00:00")));
  members.push(new MemberInfo(295998482, new Date("2022-06-11T00:00:00")));
  members.push(new MemberInfo(367303307, new Date("2022-06-17T00:00:00")));
  members.push(new MemberInfo(167246975, new Date("2022-06-26T00:00:00")));
  members.push(new MemberInfo(231445049, new Date("2022-07-05T00:00:00")));
  members.push(new MemberInfo(233698578, new Date("2022-07-05T00:00:00")));
  members.push(new MemberInfo(444831658, new Date("2022-09-05T00:00:00")));
  members.push(new MemberInfo(445619710, new Date("2022-09-06T00:00:00")));
  members.push(new MemberInfo(136595172, new Date("2022-07-06T00:00:00")));
  members.push(new MemberInfo(314320021, new Date("2022-07-07T00:00:00")));
  members.push(new MemberInfo(118184749, new Date("2022-07-07T00:00:00")));
  members.push(new MemberInfo(131495959, new Date("2022-10-07T00:00:00")));
  members.push(new MemberInfo(924336952, new Date("2022-07-08T00:00:00")));
  members.push(new MemberInfo(59388035, new Date("2022-07-08T00:00:00")));
  members.push(new MemberInfo(187818172, new Date("2022-07-08T00:00:00")));
  members.push(new MemberInfo(162679730, new Date("2022-07-08T00:00:00")));
  members.push(new MemberInfo(327729726, new Date("2022-07-09T00:00:00")));
  members.push(new MemberInfo(228819762, new Date("2022-07-11T00:00:00")));
  members.push(new MemberInfo(466149396, new Date("2022-07-11T00:00:00")));
  members.push(new MemberInfo(264142252, new Date("2022-09-12T00:00:00")));
  members.push(new MemberInfo(1274001179, new Date("2022-07-12T00:00:00")));
  members.push(new MemberInfo(360079868, new Date("2022-07-13T00:00:00")));
  members.push(new MemberInfo(149196343, new Date("2022-07-15T00:00:00")));
  members.push(new MemberInfo(1094514134, new Date("2022-07-16T00:00:00")));
  members.push(new MemberInfo(1082599576, new Date("2022-12-18T00:00:00")));
  members.push(new MemberInfo(231865537, new Date("2022-07-17T00:00:00")));
  members.push(new MemberInfo(363005190, new Date("2022-07-17T00:00:00")));
  members.push(new MemberInfo(1170873561, new Date("2022-07-19T00:00:00")));
  members.push(new MemberInfo(136341710, new Date("2022-07-19T00:00:00")));
  members.push(new MemberInfo(206351703, new Date("2022-07-20T00:00:00")));
  members.push(new MemberInfo(304433359, new Date("2022-07-21T00:00:00")));
  members.push(new MemberInfo(136842497, new Date("2022-07-21T00:00:00")));
  members.push(new MemberInfo(59663613, new Date("2022-07-22T00:00:00")));
  members.push(new MemberInfo(138652140, new Date("2022-07-23T00:00:00")));
  members.push(new MemberInfo(228803327, new Date("2022-07-26T00:00:00")));
  members.push(new MemberInfo(217109099, new Date("2022-07-26T00:00:00")));
  members.push(new MemberInfo(98162617, new Date("2022-07-30T00:00:00")));
  members.push(new MemberInfo(107625818, new Date("2023-01-04T00:00:00")));
  members.push(new MemberInfo(424394323, new Date("2023-01-05T00:00:00")));
  members.push(new MemberInfo(887874899, new Date("2022-10-04T00:00:00")));
  members.push(new MemberInfo(342049002, new Date("2022-08-07T00:00:00")));
  members.push(new MemberInfo(110663197, new Date("2022-08-07T00:00:00")));
  members.push(new MemberInfo(78534313, new Date("2022-08-07T00:00:00")));
  members.push(new MemberInfo(215738002, new Date("2022-08-12T00:00:00")));
  members.push(new MemberInfo(294278887, new Date("2022-10-13T00:00:00")));
  members.push(new MemberInfo(322271699, new Date("2022-10-13T00:00:00")));
  members.push(new MemberInfo(171217775, new Date("2023-07-24T00:00:00")));
  members.push(new MemberInfo(1166147496, new Date("2022-10-20T00:00:00")));
  members.push(new MemberInfo(176061240, new Date("2022-10-21T00:00:00")));
  members.push(new MemberInfo(127685098, new Date("2022-08-22T00:00:00")));
  members.push(new MemberInfo(213875775, new Date("2022-08-24T00:00:00")));
  members.push(new MemberInfo(226209386, new Date("2022-08-24T00:00:00")));
  members.push(new MemberInfo(143837979, new Date("2022-08-25T00:00:00")));
  members.push(new MemberInfo(241893614, new Date("2022-08-25T00:00:00")));
  members.push(new MemberInfo(156694017, new Date("2022-10-25T00:00:00")));
  members.push(new MemberInfo(213346065, new Date("2023-01-31T00:00:00")));
  members.push(new MemberInfo(208755952, new Date("2022-08-26T00:00:00")));
  members.push(new MemberInfo(174229384, new Date("2023-01-31T00:00:00")));
  members.push(new MemberInfo(129972639, new Date("2022-08-28T00:00:00")));
  members.push(new MemberInfo(241879058, new Date("2022-08-28T00:00:00")));
  members.push(new MemberInfo(140769251, new Date("2022-08-30T00:00:00")));
  members.push(new MemberInfo(186876312, new Date("2022-08-31T00:00:00")));
  members.push(new MemberInfo(121514138, new Date("2022-09-01T00:00:00")));
  members.push(new MemberInfo(849959529, new Date("2022-09-03T00:00:00")));
  members.push(new MemberInfo(148269987, new Date("2022-11-04T00:00:00")));
  members.push(new MemberInfo(295200117, new Date("2025-08-25T00:00:00")));
  members.push(new MemberInfo(139377303, new Date("2022-09-05T00:00:00")));
  members.push(new MemberInfo(129797279, new Date("2023-01-31T00:00:00")));
  members.push(new MemberInfo(422435396, new Date("2022-09-08T00:00:00")));
  members.push(new MemberInfo(404654823, new Date("2022-09-08T00:00:00")));
  members.push(new MemberInfo(318935018, new Date("2022-10-31T00:00:00")));
  members.push(new MemberInfo(86767074, new Date("2022-09-09T00:00:00")));
  members.push(new MemberInfo(73059502, new Date("2022-11-11T00:00:00")));
  members.push(new MemberInfo(932992019, new Date("2022-09-10T00:00:00")));
  members.push(new MemberInfo(141805019, new Date("2022-09-10T00:00:00")));
  members.push(new MemberInfo(140763807, new Date("2022-09-10T00:00:00")));
  members.push(new MemberInfo(967052298, new Date("2022-09-11T00:00:00")));
  members.push(new MemberInfo(84800173, new Date("2023-02-14T00:00:00")));
  members.push(new MemberInfo(112073229, new Date("2022-09-12T00:00:00")));
  members.push(new MemberInfo(1026882748, new Date("2022-09-12T00:00:00")));
  members.push(new MemberInfo(134020001, new Date("2022-09-12T00:00:00")));
  members.push(new MemberInfo(193859368, new Date("2022-09-12T00:00:00")));
  members.push(new MemberInfo(115909929, new Date("2022-09-12T00:00:00")));
  members.push(new MemberInfo(153632407, new Date("2022-12-06T00:00:00")));
  members.push(new MemberInfo(323139801, new Date("2022-09-13T00:00:00")));
  members.push(new MemberInfo(322229870, new Date("2022-09-13T00:00:00")));
  members.push(new MemberInfo(99825061, new Date("2022-09-13T00:00:00")));
  members.push(new MemberInfo(70200897, new Date("2022-09-13T00:00:00")));
  members.push(new MemberInfo(314643375, new Date("2023-02-15T00:00:00")));
  members.push(new MemberInfo(332384968, new Date("2022-09-15T00:00:00")));
  members.push(new MemberInfo(338188516, new Date("2022-09-15T00:00:00")));
  members.push(new MemberInfo(109270703, new Date("2022-09-15T00:00:00")));
  members.push(new MemberInfo(118324486, new Date("2022-09-16T00:00:00")));
  members.push(new MemberInfo(840087655, new Date("2022-09-17T00:00:00")));
  members.push(new MemberInfo(354325944, new Date("2022-12-18T00:00:00")));
  members.push(new MemberInfo(86802334, new Date("2022-12-18T00:00:00")));
  members.push(new MemberInfo(295612065, new Date("2022-09-18T00:00:00")));
  members.push(new MemberInfo(138189607, new Date("2022-09-18T00:00:00")));
  members.push(new MemberInfo(292827485, new Date("2023-09-19T00:00:00")));
  members.push(new MemberInfo(955766569, new Date("2023-02-22T00:00:00")));
  members.push(new MemberInfo(121577760, new Date("2022-09-20T00:00:00")));
  members.push(new MemberInfo(139073897, new Date("2023-03-22T00:00:00")));
  members.push(new MemberInfo(317958553, new Date("2022-09-21T00:00:00")));
  members.push(new MemberInfo(245559423, new Date("2022-09-21T00:00:00")));
  members.push(new MemberInfo(174352044, new Date("2022-11-22T00:00:00")));
  members.push(new MemberInfo(971109837, new Date("2022-09-21T00:00:00")));
  members.push(new MemberInfo(436523601, new Date("2022-09-21T00:00:00")));
  members.push(new MemberInfo(368432773, new Date("2022-09-22T00:00:00")));
  members.push(new MemberInfo(1033313629, new Date("2023-02-24T00:00:00")));
  members.push(new MemberInfo(129745055, new Date("2022-09-22T00:00:00")));
  members.push(new MemberInfo(889187695, new Date("2022-09-25T00:00:00")));
  members.push(new MemberInfo(430821592, new Date("2022-09-25T00:00:00")));
  members.push(new MemberInfo(151516554, new Date("2022-09-26T00:00:00")));
  members.push(new MemberInfo(293124651, new Date("2022-09-26T00:00:00")));
  members.push(new MemberInfo(330994098, new Date("2023-03-31T00:00:00")));
  members.push(new MemberInfo(141358534, new Date("2022-09-27T00:00:00")));
  members.push(new MemberInfo(156268618, new Date("2022-09-27T00:00:00")));
  members.push(new MemberInfo(136373823, new Date("2022-09-28T00:00:00")));
  members.push(new MemberInfo(393340089, new Date("2022-09-28T00:00:00")));
  members.push(new MemberInfo(125335441, new Date("2022-09-28T00:00:00")));
  members.push(new MemberInfo(353885092, new Date("2022-10-28T00:00:00")));
  members.push(new MemberInfo(386472436, new Date("2022-09-29T00:00:00")));
  members.push(new MemberInfo(303743871, new Date("2022-09-29T00:00:00")));
  members.push(new MemberInfo(407346170, new Date("2022-09-29T00:00:00")));
  members.push(new MemberInfo(111889821, new Date("2022-09-30T00:00:00")));
  members.push(new MemberInfo(435333920, new Date("2023-03-04T00:00:00")));
  // patreon
  members.push(new MemberInfo(67723423, new Date("2022-10-01T00:00:00")));
  members.push(new MemberInfo(86539525, new Date("2022-10-01T00:00:00")));
  // 到期
  members.push(new MemberInfo(1318433532, new Date("2022-08-31T00:00:00")));
  // 测试
  members.push(new MemberInfo(916506173, new Date("2022-08-01T00:00:00")));
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
  members.push(new Member(124111398));
  members.push(new Member(120921523));
  members.push(new Member(146837505));
  members.push(new Member(136385488));
  members.push(new Member(907056028));
  // 会员
  members.push(new Member(108208968, new Date("2022-07-20T00:00:00")));
  members.push(new Member(107451500, new Date("2022-05-20T00:00:00")));
  members.push(new Member(141315077, new Date("2022-07-20T00:00:00")));
  members.push(new Member(117417953, new Date("2023-04-20T00:00:00")));
  members.push(new Member(319701690, new Date("2022-05-20T00:00:00")));
  members.push(new Member(142964279, new Date("2022-07-20T00:00:00")));
  members.push(new Member(125049949, new Date("2022-06-20T00:00:00")));
  members.push(new Member(150252080, new Date("2025-04-20T00:00:00")));
  members.push(new Member(355472172, new Date("2022-05-23T00:00:00")));
  members.push(new Member(445801587, new Date("2022-05-23T00:00:00")));
  members.push(new Member(308320923, new Date("2022-05-23T00:00:00")));
  members.push(new Member(190540884, new Date("2022-05-24T00:00:00")));
  members.push(new Member(1009673688, new Date("2022-05-24T00:00:00")));
  members.push(new Member(342865365, new Date("2022-10-26T00:00:00")));
  members.push(new Member(379664769, new Date("2022-05-24T00:00:00")));
  members.push(new Member(153272663, new Date("2022-07-26T00:00:00")));
  members.push(new Member(882465781, new Date("2022-05-26T00:00:00")));
  members.push(new Member(360222290, new Date("2023-05-03T00:00:00")));
  members.push(new Member(185047994, new Date("2022-05-29T00:00:00")));
  members.push(new Member(180838006, new Date("2022-05-30T00:00:00")));
  members.push(new Member(874713025, new Date("2022-05-31T00:00:00")));
  members.push(new Member(144800834, new Date("2022-05-31T00:00:00")));
  members.push(new Member(141548767, new Date("2022-06-01T00:00:00")));
  members.push(new Member(180389221, new Date("2022-08-02T00:00:00")));
  members.push(new Member(251171524, new Date("2022-12-02T00:00:00")));
  members.push(new Member(275500980, new Date("2022-06-02T00:00:00")));
  members.push(new Member(235845422, new Date("2022-11-04T00:00:00")));
  members.push(new Member(908271686, new Date("2022-06-02T00:00:00")));
  members.push(new Member(918581722, new Date("2022-08-03T00:00:00")));
  members.push(new Member(306190449, new Date("2022-06-02T00:00:00")));
  members.push(new Member(179404686, new Date("2022-06-02T00:00:00")));
  members.push(new Member(374719134, new Date("2022-06-02T00:00:00")));
  members.push(new Member(864363572, new Date("2022-06-04T00:00:00")));
  members.push(new Member(136940046, new Date("2022-06-05T00:00:00")));
  members.push(new Member(208461180, new Date("2023-05-12T00:00:00")));
  members.push(new Member(101812265, new Date("2022-06-06T00:00:00")));
  members.push(new Member(142753729, new Date("2022-06-07T00:00:00")));
  members.push(new Member(1062548803, new Date("2022-06-08T00:00:00")));
  members.push(new Member(1272840276, new Date("2022-11-10T00:00:00")));
  members.push(new Member(295998482, new Date("2022-06-11T00:00:00")));
  members.push(new Member(367303307, new Date("2022-06-17T00:00:00")));
  members.push(new Member(167246975, new Date("2022-06-26T00:00:00")));
  members.push(new Member(231445049, new Date("2022-07-05T00:00:00")));
  members.push(new Member(233698578, new Date("2022-07-05T00:00:00")));
  members.push(new Member(444831658, new Date("2022-09-05T00:00:00")));
  members.push(new Member(445619710, new Date("2022-09-06T00:00:00")));
  members.push(new Member(136595172, new Date("2022-07-06T00:00:00")));
  members.push(new Member(314320021, new Date("2022-07-07T00:00:00")));
  members.push(new Member(118184749, new Date("2022-07-07T00:00:00")));
  members.push(new Member(131495959, new Date("2022-10-07T00:00:00")));
  members.push(new Member(924336952, new Date("2022-07-08T00:00:00")));
  members.push(new Member(59388035, new Date("2022-07-08T00:00:00")));
  members.push(new Member(187818172, new Date("2022-07-08T00:00:00")));
  members.push(new Member(162679730, new Date("2022-07-08T00:00:00")));
  members.push(new Member(327729726, new Date("2022-07-09T00:00:00")));
  members.push(new Member(228819762, new Date("2022-07-11T00:00:00")));
  members.push(new Member(466149396, new Date("2022-07-11T00:00:00")));
  members.push(new Member(264142252, new Date("2022-09-12T00:00:00")));
  members.push(new Member(1274001179, new Date("2022-07-12T00:00:00")));
  members.push(new Member(360079868, new Date("2022-07-13T00:00:00")));
  members.push(new Member(149196343, new Date("2022-07-15T00:00:00")));
  members.push(new Member(1094514134, new Date("2022-07-16T00:00:00")));
  members.push(new Member(1082599576, new Date("2022-12-18T00:00:00")));
  members.push(new Member(231865537, new Date("2022-07-17T00:00:00")));
  members.push(new Member(363005190, new Date("2022-07-17T00:00:00")));
  members.push(new Member(1170873561, new Date("2022-07-19T00:00:00")));
  members.push(new Member(136341710, new Date("2022-07-19T00:00:00")));
  members.push(new Member(206351703, new Date("2022-07-20T00:00:00")));
  members.push(new Member(304433359, new Date("2022-07-21T00:00:00")));
  members.push(new Member(136842497, new Date("2022-07-21T00:00:00")));
  members.push(new Member(59663613, new Date("2022-07-22T00:00:00")));
  members.push(new Member(138652140, new Date("2022-07-23T00:00:00")));
  members.push(new Member(228803327, new Date("2022-07-26T00:00:00")));
  members.push(new Member(217109099, new Date("2022-07-26T00:00:00")));
  members.push(new Member(98162617, new Date("2022-07-30T00:00:00")));
  members.push(new Member(107625818, new Date("2023-01-04T00:00:00")));
  members.push(new Member(424394323, new Date("2023-01-05T00:00:00")));
  members.push(new Member(887874899, new Date("2022-10-04T00:00:00")));
  members.push(new Member(342049002, new Date("2022-05-26T00:00:00")));
  members.push(new Member(110663197, new Date("2022-08-07T00:00:00")));
  members.push(new Member(78534313, new Date("2022-08-07T00:00:00")));
  members.push(new Member(215738002, new Date("2022-08-12T00:00:00")));
  members.push(new Member(294278887, new Date("2022-10-13T00:00:00")));
  members.push(new Member(322271699, new Date("2022-10-13T00:00:00")));
  members.push(new Member(171217775, new Date("2023-07-24T00:00:00")));
  members.push(new Member(1166147496, new Date("2022-10-20T00:00:00")));
  members.push(new Member(176061240, new Date("2022-10-21T00:00:00")));
  members.push(new Member(127685098, new Date("2022-08-22T00:00:00")));
  members.push(new Member(213875775, new Date("2022-08-24T00:00:00")));
  members.push(new Member(226209386, new Date("2022-08-24T00:00:00")));
  members.push(new Member(143837979, new Date("2022-08-25T00:00:00")));
  members.push(new Member(241893614, new Date("2022-08-25T00:00:00")));
  members.push(new Member(156694017, new Date("2022-10-25T00:00:00")));
  members.push(new Member(213346065, new Date("2023-01-31T00:00:00")));
  members.push(new Member(208755952, new Date("2022-08-26T00:00:00")));
  members.push(new Member(174229384, new Date("2023-01-31T00:00:00")));
  members.push(new Member(129972639, new Date("2022-08-28T00:00:00")));
  members.push(new Member(241879058, new Date("2022-08-28T00:00:00")));
  members.push(new Member(140769251, new Date("2022-08-30T00:00:00")));
  members.push(new Member(186876312, new Date("2022-08-31T00:00:00")));
  members.push(new Member(121514138, new Date("2022-09-01T00:00:00")));
  members.push(new Member(849959529, new Date("2022-09-03T00:00:00")));
  members.push(new Member(148269987, new Date("2022-11-04T00:00:00")));
  members.push(new Member(295200117, new Date("2025-08-25T00:00:00")));
  members.push(new Member(139377303, new Date("2022-09-05T00:00:00")));
  members.push(new Member(129797279, new Date("2023-01-31T00:00:00")));
  members.push(new Member(422435396, new Date("2022-09-08T00:00:00")));
  members.push(new Member(404654823, new Date("2022-09-08T00:00:00")));
  members.push(new Member(318935018, new Date("2022-10-31T00:00:00")));
  members.push(new Member(86767074, new Date("2022-09-09T00:00:00")));
  members.push(new Member(73059502, new Date("2022-11-11T00:00:00")));
  members.push(new Member(932992019, new Date("2022-09-10T00:00:00")));
  members.push(new Member(141805019, new Date("2022-09-10T00:00:00")));
  members.push(new Member(140763807, new Date("2022-09-10T00:00:00")));
  members.push(new Member(967052298, new Date("2022-09-11T00:00:00")));
  members.push(new Member(84800173, new Date("2023-02-14T00:00:00")));
  members.push(new Member(112073229, new Date("2022-09-12T00:00:00")));
  members.push(new Member(1026882748, new Date("2022-09-12T00:00:00")));
  members.push(new Member(134020001, new Date("2022-09-12T00:00:00")));
  members.push(new Member(193859368, new Date("2022-09-12T00:00:00")));
  members.push(new Member(115909929, new Date("2022-09-12T00:00:00")));
  members.push(new Member(153632407, new Date("2022-12-06T00:00:00")));
  members.push(new Member(323139801, new Date("2022-09-13T00:00:00")));
  members.push(new Member(322229870, new Date("2022-09-13T00:00:00")));
  members.push(new Member(99825061, new Date("2022-09-13T00:00:00")));
  members.push(new Member(70200897, new Date("2022-09-13T00:00:00")));
  members.push(new Member(314643375, new Date("2023-02-15T00:00:00")));
  members.push(new Member(332384968, new Date("2022-09-15T00:00:00")));
  members.push(new Member(338188516, new Date("2022-09-15T00:00:00")));
  members.push(new Member(109270703, new Date("2022-09-15T00:00:00")));
  members.push(new Member(118324486, new Date("2022-09-16T00:00:00")));
  members.push(new Member(840087655, new Date("2022-09-17T00:00:00")));
  members.push(new Member(354325944, new Date("2022-12-18T00:00:00")));
  members.push(new Member(86802334, new Date("2022-12-18T00:00:00")));
  members.push(new Member(295612065, new Date("2022-09-18T00:00:00")));
  members.push(new Member(138189607, new Date("2022-09-18T00:00:00")));
  members.push(new Member(292827485, new Date("2023-09-19T00:00:00")));
  members.push(new Member(955766569, new Date("2023-02-22T00:00:00")));
  members.push(new Member(121577760, new Date("2022-09-20T00:00:00")));
  members.push(new Member(139073897, new Date("2023-03-22T00:00:00")));
  members.push(new Member(317958553, new Date("2022-09-21T00:00:00")));
  members.push(new Member(245559423, new Date("2022-09-21T00:00:00")));
  members.push(new Member(174352044, new Date("2022-11-22T00:00:00")));
  members.push(new Member(971109837, new Date("2022-09-21T00:00:00")));
  members.push(new Member(436523601, new Date("2022-09-21T00:00:00")));
  members.push(new Member(368432773, new Date("2022-09-22T00:00:00")));
  members.push(new Member(1033313629, new Date("2023-02-24T00:00:00")));
  members.push(new Member(129745055, new Date("2022-09-22T00:00:00")));
  members.push(new Member(889187695, new Date("2022-09-25T00:00:00")));
  members.push(new Member(430821592, new Date("2022-09-25T00:00:00")));
  members.push(new Member(151516554, new Date("2022-09-26T00:00:00")));
  members.push(new Member(293124651, new Date("2022-09-26T00:00:00")));
  members.push(new Member(330994098, new Date("2023-03-31T00:00:00")));
  members.push(new Member(141358534, new Date("2022-09-27T00:00:00")));
  members.push(new Member(156268618, new Date("2022-09-27T00:00:00")));
  members.push(new Member(136373823, new Date("2022-09-28T00:00:00")));
  members.push(new Member(393340089, new Date("2022-09-28T00:00:00")));
  members.push(new Member(125335441, new Date("2022-09-28T00:00:00")));
  members.push(new Member(353885092, new Date("2022-10-28T00:00:00")));
  members.push(new Member(386472436, new Date("2022-09-29T00:00:00")));
  members.push(new Member(303743871, new Date("2022-09-29T00:00:00")));
  members.push(new Member(407346170, new Date("2022-09-29T00:00:00")));
  members.push(new Member(111889821, new Date("2022-09-30T00:00:00")));
  members.push(new Member(435333920, new Date("2023-03-04T00:00:00")));
  // patreon
  members.push(new Member(67723423, new Date("2022-10-01T00:00:00")));
  members.push(new Member(86539525, new Date("2022-10-01T00:00:00")));
  // 到期
  members.push(new Member(1318433532, new Date("2022-08-31T00:00:00")));
  // 测试
  members.push(new Member(916506173, new Date("2022-08-01T00:00:00")));
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
