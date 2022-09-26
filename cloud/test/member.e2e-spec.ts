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
  });

  describe('members/ (GET)', () => {
    it('get not exist member return 404', () => {
      return request(app.getHttpServer())
        .get('/api/members/987654321')
        .expect(404);
    });
  });

  describe('members/ (POST)', () => {
    it('create not exist member return 201', async () => {
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
      expect(responseCreate.body).toEqual({
        steamId: 123456789,
        expireDateString: expect.any(String),
        enable: true,
      });
      // exist after created
      const responseAfter = await request(app.getHttpServer()).get(
        '/api/members/123456789',
      );
      expect(responseAfter.status).toEqual(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
