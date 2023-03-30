import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { get, initTest, post } from './util';

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
      expect(result.status).toEqual(404);

    });
  });

  describe(`${playerPatchUrl}:steamId (Patch)`, () => {
    it('创建玩家', async () => {
      await post(app, `${playerPatchUrl}300000001`, {})
      const result = await get(app, `${playerGetUrl}300000001`)
      expect(result.status).toEqual(200);
      expect(result.body.steamId).toEqual(300000001);
      expect(result.body.memberPointTotal).toEqual(0);
      expect(result.body.seasonPointTotal).toEqual(0);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
