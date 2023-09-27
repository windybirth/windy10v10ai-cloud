import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { get, initTest, post } from './util';

const gameStartUrl = '/api/game/start/';
const playerGetUrl = '/api/player/steamId/';
const memberPostUrl = '/api/members/';

function callGameStart(
  app: INestApplication,
  steamIds: number[],
): request.Test {
  const apiKey = 'apikey';
  const countryCode = 'CN';
  const headers = {
    'x-api-key': apiKey,
    'x-country-code': countryCode,
  };

  return request(app.getHttpServer())
    .get(gameStartUrl)
    .query({ steamIds })
    .set(headers);
}

describe('PlayerController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await initTest();
  });

  describe(`${gameStartUrl} (Get)`, () => {
    describe('单人开始', () => {
      it('普通玩家 新玩家 首次', async () => {
        const steamIds = [100000001];

        const result = await get(app, gameStartUrl, { steamIds });
        expect(result.status).toEqual(200);
        // assert player
        const playerResult = await get(app, `${playerGetUrl}100000001`);
        expect(playerResult.status).toEqual(200);
        expect(playerResult.body.memberPointTotal).toEqual(0);
        expect(playerResult.body.seasonPointTotal).toEqual(0);
      });

      // it('普通玩家 老玩家 当日首次', async () => {});
      it('会员 新玩家 当日首次', async () => {
        await post(app, memberPostUrl, {
          steamId: 100000011,
          month: 1,
        });
        const steamIds = [100000011];

        const result = await callGameStart(app, steamIds);
        expect(result.status).toEqual(200);
        // assert player
        const playerResult = await get(app, `${playerGetUrl}100000011`);
        expect(playerResult.status).toEqual(200);
        expect(playerResult.body.memberPointTotal).toEqual(60);
        // TODO 賽季積分的时间还没有到
        expect(playerResult.body.seasonPointTotal).toEqual(0);
      });
      // it('会员 老玩家 当日首次', async () => {});
    });

    // describe('多人开始', () => {
    //   it('普通玩家 会员', async () => {
    //     await post(app, memberPostUrl, {
    //       steamId: 100000032,
    //       month: 1,
    //     });
    //     const steamIds = [100000030, 100000031, 100000032];

    //     const result = await callGameStart(app, steamIds);
    //     expect(result.status).toEqual(200);
    //   });
    // });
  });

  afterAll(async () => {
    await app.close();
  });
});
