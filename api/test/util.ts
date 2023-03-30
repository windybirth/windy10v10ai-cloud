import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from './../src/app.module';
import { AppGlobalSettings } from './../src/util/settings';
import * as request from 'supertest';

export async function initTest(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  AppGlobalSettings(app);
  return await app.init();
}

export function get(app: INestApplication, url: string): request.Test {
  return request(app.getHttpServer()).get(url);
}

export function post(app: INestApplication, url: string, body: object): request.Test {
  return request(app.getHttpServer()).post(url).send(body);
}