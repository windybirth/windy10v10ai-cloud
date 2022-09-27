import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';

describe('MemberController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // 初始化创建所有会员（仅供测试）
    await request(app.getHttpServer()).post('/api/members/all?token=123');
  });

  describe('members/ (GET)', () => {
    it('获取不存在的会员 return 404', () => {
      return request(app.getHttpServer())
        .get('/api/members/987654321')
        .expect(404);
    });
    it('获取存在已过期的会员 return 200 and enable false', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/members/20200801',
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        steamId: 20200801,
        expireDateString: '2020-08-01',
        enable: false,
      });
    });
    it('获取存在且有效的会员 return 200 and enable true', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/members/20300801',
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        steamId: 20300801,
        expireDateString: '2030-08-01',
        enable: true,
      });
    });
  });

  describe('members/ (POST)', () => {
    it('开通新会员', async () => {
      const dateNextMonth = new Date();
      dateNextMonth.setUTCDate(
        new Date().getUTCDate() + +process.env.DAYS_PER_MONTH,
      );
      const expectBodyJson = {
        steamId: 123456789,
        expireDateString: dateNextMonth.toISOString().split('T')[0],
        enable: true,
      };
      // not exist before created
      const responseBefore = await request(app.getHttpServer()).get(
        '/api/members/123456789',
      );
      expect(responseBefore.status).toEqual(404);
      // create not exist member return 201
      const responseCreate = await request(app.getHttpServer())
        .post('/api/members')
        .send({
          steamId: 123456789,
          month: 1,
        })
        .query({ token: 123 });
      expect(responseCreate.status).toEqual(201);
      expect(responseCreate.body).toEqual(expectBodyJson);
      // exist after created
      const responseAfter = await request(app.getHttpServer()).get(
        '/api/members/123456789',
      );
      expect(responseAfter.status).toEqual(200);
      expect(responseAfter.body).toEqual(expectBodyJson);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
