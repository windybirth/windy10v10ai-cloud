import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/')
      .expect(200)
      .expect('Hello, this is the root of Hosting API! Env: develop');
  });
  describe('member', () => {
    it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/api/members/123456789')
        .expect(200)
        .expect('');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
