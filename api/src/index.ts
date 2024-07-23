import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as functions from 'firebase-functions';
import { defineSecret } from 'firebase-functions/params';
import { onRequest } from 'firebase-functions/v2/https';

import { AppModule } from './app.module';
import { SECRET } from './util/secrets';
import { AppGlobalSettings } from './util/settings';

// NestJS app
const server = express();

const promiseApplicationReady = NestFactory.create(
  AppModule,
  new ExpressAdapter(server),
).then((app) => {
  AppGlobalSettings(app);
  return app.init();
});

// Secrets
const secrets = [
  defineSecret(SECRET.SERVER_APIKEY),
  defineSecret(SECRET.SERVER_APIKEY_TEST),
];

// Cloud Functions
export const api = functions
  .region('asia-northeast1')
  .runWith({ minInstances: 0, maxInstances: 10, timeoutSeconds: 10, secrets })
  .https.onRequest(async (...args) => {
    const regex = '^/api/(game|afdian).*';
    const path = args[0].path;
    if (!path.match(regex)) {
      functions.logger.warn(
        `Abnormal requeston API Cloud Function! Path: ${path}`,
      );
      args[1].status(403).send('Invalid path');
    } else {
      await promiseApplicationReady;
      server(...args);
    }
  });

export const admin = functions
  .region('asia-northeast1')
  .runWith({
    minInstances: 0,
    maxInstances: 2,
    timeoutSeconds: 540,
    secrets,
  })
  .https.onRequest(async (...args) => {
    await promiseApplicationReady;
    server(...args);
  });

export const patreon = onRequest(
  {
    region: 'asia-northeast1',
    minInstances: 0,
    maxInstances: 1,
    timeoutSeconds: 60,
    secrets: [defineSecret(SECRET.PATREON_SECRET)],
  },
  (req, res) => {
    const regex = '^/api/patreon.*';
    callServerWithRegex(regex, req, res);
  },
);

async function callServerWithRegex(
  regex: string,
  ...args: [req: functions.https.Request, resp: functions.Response<any>]
) {
  const path = args[0].path;
  if (path.match(regex)) {
    await promiseApplicationReady;
    server(...args);
  } else {
    functions.logger.warn(
      `Abnormal requeston API Cloud Function! Path: ${path}`,
    );
    args[1].status(403).send('Invalid path');
  }
}
