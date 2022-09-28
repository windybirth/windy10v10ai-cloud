import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { initTest } from './util';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await initTest();
  });

  it('/api/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/')
      .expect(200)
      .expect('Hello, this is the root of Hosting API! Env: test');
  });

  afterAll(async () => {
    await app.close();
  });
});
