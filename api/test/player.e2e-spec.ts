import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { get, initTest, patch, post } from './util';

describe('PlayerController (e2e)', () => {
  const playerGetUrl = '/api/player/steamId/';
  const playerPatchUrl = '/api/player/steamId/';

  let app: INestApplication;

  beforeAll(async () => {
    app = await initTest();
  });


  describe(`${playerGetUrl}:steamId (Get)`, () => {
    it('获取不存在的玩家 return 404', async () => {
      const result = await get(app, `${playerGetUrl}300009999`)
      expect(result.body.steamId).toBeUndefined();
    });
  });

  describe(`${playerPatchUrl}:steamId (Patch)`, () => {
    it('创建玩家', async () => {
      await patch(app, `${playerPatchUrl}300000001`, {})
      const result = await get(app, `${playerGetUrl}300000001`)
      expect(result.status).toEqual(200);
      expect(result.body.id).toEqual("300000001");
      expect(result.body.memberPointTotal).toEqual(0);
      expect(result.body.seasonPointTotal).toEqual(0);
      // 追加积分
      await patch(app, `${playerPatchUrl}300000001`, {
        memberPointTotal: 100,
        seasonPointTotal: 200,
      })
      const result2 = await get(app, `${playerGetUrl}300000001`)
      expect(result2.status).toEqual(200);
      expect(result2.body.id).toEqual("300000001");
      expect(result2.body.memberPointTotal).toEqual(100);
      expect(result2.body.seasonPointTotal).toEqual(200);
    });


    it('创建玩家指定积分', async () => {
      await patch(app, `${playerPatchUrl}300000002`, {
        memberPointTotal: 100,
        seasonPointTotal: 200,
      })
      const result = await get(app, `${playerGetUrl}300000002`)
      expect(result.status).toEqual(200);
      expect(result.body.id).toEqual("300000002");
      expect(result.body.memberPointTotal).toEqual(100);
      expect(result.body.seasonPointTotal).toEqual(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
