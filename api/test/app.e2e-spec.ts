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
      .expect((s) => expect(s.text).toContain('local'))
      .expect((s) => expect(s.text).toContain('test-github-env'));
  });

  afterAll(async () => {
    await app.close();
  });
});
