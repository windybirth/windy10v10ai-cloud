import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as functions from 'firebase-functions';
import { AppModule } from './app.module';

const server = express();

const promiseApplicationReady = NestFactory.create(
  AppModule,
  new ExpressAdapter(server),
).then((app) => app.init());

export const api = functions
  .region('asia-northeast1')
  .https.onRequest(async (...args) => {
    await promiseApplicationReady;
    server(...args);
  });
