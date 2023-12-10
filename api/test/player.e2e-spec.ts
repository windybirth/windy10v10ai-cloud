import { INestApplication } from '@nestjs/common';

import { get, initTest, patch } from './util';

describe('PlayerController (e2e)', () => {
  const playerGetUrl = '/api/player/steamId/';
  const playerPatchUrl = '/api/player/steamId/';

  let app: INestApplication;

  beforeAll(async () => {
    app = await initTest();
  });

  describe(`${playerGetUrl}:steamId (Get)`, () => {
    it('获取不存在的玩家 return 404', async () => {
      const result = await get(app, `${playerGetUrl}300009999`);
      expect(result.body.steamId).toBeUndefined();
    });
  });

  describe(`${playerPatchUrl}:steamId (Patch)`, () => {
    it('创建玩家', async () => {
      await patch(app, `${playerPatchUrl}300000001`, {});
      const result = await get(app, `${playerGetUrl}300000001`);
      expect(result.status).toEqual(200);
      expect(result.body.id).toEqual('300000001');
      expect(result.body.memberPointTotal).toEqual(0);
      expect(result.body.seasonPointTotal).toEqual(0);
      // 追加积分
      await patch(app, `${playerPatchUrl}300000001`, {
        memberPointTotal: 100,
        seasonPointTotal: 200,
      }).expect(200);
      const result2 = await get(app, `${playerGetUrl}300000001`);
      expect(result2.status).toEqual(200);
      expect(result2.body.id).toEqual('300000001');
      expect(result2.body.memberPointTotal).toEqual(100);
      expect(result2.body.seasonPointTotal).toEqual(200);
    });

    it('创建玩家指定积分', async () => {
      await patch(app, `${playerPatchUrl}300000002`, {
        memberPointTotal: 100,
        seasonPointTotal: 200,
      }).expect(200);
      const result = await get(app, `${playerGetUrl}300000002`);
      expect(result.status).toEqual(200);
      expect(result.body.id).toEqual('300000002');
      expect(result.body.memberPointTotal).toEqual(100);
      expect(result.body.seasonPointTotal).toEqual(200);
    });
  });

  // describe(`${playerRestUrl} (POST) 重置玩家赛季积分`, () => {
  //   it('赛季积分 0', async () => {
  //     const steamId = '300001001';
  //     await patch(app, `${playerPatchUrl}${steamId}`, {
  //       memberPointTotal: 100,
  //       seasonPointTotal: 0,
  //     }).expect(200);
  //     await post(app, `${playerRestUrl}`, {
  //       resetPercent: 50,
  //     }).expect(201);
  //     const result = await get(app, `${playerGetUrl}${steamId}`);
  //     expect(result.status).toEqual(200);
  //     expect(result.body.id).toEqual(steamId);
  //     expect(result.body.memberPointTotal).toEqual(100);
  //     expect(result.body.seasonPointTotal).toEqual(0);
  //   });

  //   it('赛季积分 500', async () => {
  //     const steamId = '300001002';
  //     await patch(app, `${playerPatchUrl}${steamId}`, {
  //       memberPointTotal: 100,
  //       seasonPointTotal: 500,
  //     }).expect(200);
  //     await post(app, `${playerRestUrl}`, {
  //       resetPercent: 50,
  //     }).expect(201);
  //     const result = await get(app, `${playerGetUrl}${steamId}`);
  //     expect(result.status).toEqual(200);
  //     expect(result.body.id).toEqual(steamId);
  //     expect(result.body.memberPointTotal).toEqual(100);
  //     expect(result.body.seasonPointTotal).toEqual(500);
  //   });

  //   it('赛季积分 29000', async () => {
  //     const steamId = '300001003';
  //     await patch(app, `${playerPatchUrl}${steamId}`, {
  //       memberPointTotal: 100,
  //       seasonPointTotal: 29000,
  //     }).expect(200);
  //     await post(app, `${playerRestUrl}`, {
  //       resetPercent: 50,
  //     }).expect(201);
  //     const result = await get(app, `${playerGetUrl}${steamId}`);
  //     expect(result.status).toEqual(200);
  //     expect(result.body.id).toEqual(steamId);
  //     expect(result.body.memberPointTotal).toEqual(100);
  //     expect(result.body.seasonPointTotal).toEqual(14500);
  //     expect(result.body.thirdSeasonLevel).toEqual(24);
  //   });
  // });

  afterAll(async () => {
    await app.close();
  });
});
