import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { get, initTest, mockDate, post, restoreDate } from './util';

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

  afterEach(() => {
    restoreDate();
  });

  describe(`${gameStartUrl} (Get)`, () => {
    describe('单人开始', () => {
      it('普通玩家 新玩家 首次', async () => {
        mockDate('2023-12-01T00:00:00.000Z');
        const steamIds = [100000001];

        const result = await get(app, gameStartUrl, { steamIds });
        expect(result.status).toEqual(200);
        // assert player
        const playerResult = await get(app, `${playerGetUrl}100000001`);
        expect(playerResult.status).toEqual(200);
        expect(playerResult.body.memberPointTotal).toEqual(0);
        expect(playerResult.body.seasonPointTotal).toEqual(0);
      });

      it('普通玩家 老玩家 当日首次', async () => {
        const steamIds = [100000002];

        mockDate('2023-12-01T00:00:00.000Z');
        const result = await get(app, gameStartUrl, { steamIds });
        expect(result.status).toEqual(200);
        // assert player
        const playerResult = await get(app, `${playerGetUrl}100000002`);
        expect(playerResult.body.memberPointTotal).toEqual(0);
        expect(playerResult.body.seasonPointTotal).toEqual(0);

        mockDate('2023-12-02T00:00:00.000Z');
        const result2 = await get(app, gameStartUrl, { steamIds });
        expect(result2.status).toEqual(200);
        // assert player
        const playerResult2 = await get(app, `${playerGetUrl}100000002`);
        expect(playerResult2.body.memberPointTotal).toEqual(0);
        expect(playerResult2.body.seasonPointTotal).toEqual(0);
      });

      it('有效会员 新玩家 当日首次', async () => {
        const steamIds = [100000011];

        mockDate('2023-12-01T00:00:00.000Z');
        await post(app, memberPostUrl, {
          steamId: 100000011,
          month: 1,
        });

        const result = await callGameStart(app, steamIds);
        expect(result.status).toEqual(200);
        // assert player
        const playerResult = await get(app, `${playerGetUrl}100000011`);
        expect(playerResult.body.memberPointTotal).toEqual(100);
        expect(playerResult.body.seasonPointTotal).toEqual(0);
      });

      it.each([
        [
          '有效会员 二日首次登录 赋予积分',
          '2023-12-01T00:00:00.000Z',
          100000012,
          '2023-12-01T00:00:00.000Z',
          100,
          '2023-12-02T00:00:00.000Z',
          200,
        ],
        [
          '有效会员 当日第二次 不赋予积分',
          '2023-12-01T00:00:00.000Z',
          100000013,
          '2023-12-01T00:00:00.000Z',
          100,
          '2023-12-01T01:00:00.000Z',
          100,
        ],
        [
          '会员过期后 不赋予积分',
          '2023-10-01T00:00:00.000Z',
          100000014,
          '2023-11-01T00:00:00.000Z',
          100,
          '2023-11-02T01:00:00.000Z',
          100,
        ],
      ])(
        '%s',
        async (title, dateMember, steamId, date1, point1, date2, point2) => {
          mockDate(dateMember);
          await post(app, memberPostUrl, {
            steamId: steamId,
            month: 1,
          });

          mockDate(date1);
          const result = await get(app, gameStartUrl, { steamIds: [steamId] });
          expect(result.status).toEqual(200);
          // assert player
          const playerResult = await get(app, `${playerGetUrl}${steamId}`);
          expect(playerResult.body.memberPointTotal).toEqual(point1);
          expect(playerResult.body.seasonPointTotal).toEqual(0);

          mockDate(date2);
          const result2 = await get(app, gameStartUrl, { steamIds: [steamId] });
          expect(result2.status).toEqual(200);
          // assert player
          const playerResult2 = await get(app, `${playerGetUrl}${steamId}`);
          expect(playerResult2.body.memberPointTotal).toEqual(point2);
          expect(playerResult2.body.seasonPointTotal).toEqual(0);
        },
      );
    });

    describe('双旦活动', () => {
      it.each([
        ['普通玩家 活动开始前', '2023-12-24T14:59:00.000Z', 100000101, 0, 0],
        ['普通玩家 活动开始时', '2023-12-24T15:01:00.000Z', 100000102, 0, 3000],
        ['普通玩家 活动结束前', '2024-01-03T23:59:00.000Z', 100000103, 0, 3000],
        ['普通玩家 活动结束后', '2024-01-04T00:01:00.000Z', 100000104, 0, 0],
      ])(
        '%s',
        async (title, date, steamId, memberPointTotal, seasonPointTotal) => {
          mockDate(date);
          const result = await get(app, gameStartUrl, { steamIds: [steamId] });
          expect(result.status).toEqual(200);
          // assert player
          const playerResult = await get(app, `${playerGetUrl}${steamId}`);
          expect(playerResult.status).toEqual(200);
          expect(playerResult.body.memberPointTotal).toEqual(memberPointTotal);
          expect(playerResult.body.seasonPointTotal).toEqual(seasonPointTotal);
        },
      );
    });

    describe('多人开始', () => {
      it('普通玩家 会员', async () => {
        await post(app, memberPostUrl, {
          steamId: 100000032,
          month: 1,
        });
        const steamIds = [100000030, 100000031, 100000032];

        const result = await callGameStart(app, steamIds);
        expect(result.status).toEqual(200);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
