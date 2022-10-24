import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as functions from 'firebase-functions';

import { AppModule } from './app.module';
import { AppGlobalSettings } from './util/settings';

const server = express();

const promiseApplicationReady = NestFactory.create(
  AppModule,
  new ExpressAdapter(server),
).then((app) => {
  AppGlobalSettings(app);
  return app.init();
});

export const api = functions
  .region('asia-northeast1')
  .runWith({ minInstances: 0, maxInstances: 10, timeoutSeconds: 10 })
  .https.onRequest(async (...args) => {
    await promiseApplicationReady;
    server(...args);
  });

export const admin = functions
  .region('asia-northeast1')
  .runWith({ minInstances: 0, maxInstances: 2, timeoutSeconds: 120 })
  .https.onRequest(async (...args) => {
    await promiseApplicationReady;
    server(...args);
  });
