import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as functions from 'firebase-functions';
import { AppModule } from './app.module';
// Import firebase-admin
import * as admin from 'firebase-admin';

const server = express();

// Initialize the firebase admin app
admin.initializeApp();
console.log('[Loading] firebase admin initialized.');

const promiseApplicationReady = NestFactory.create(
  AppModule,
  new ExpressAdapter(server),
).then((app) => app.init());

export const api = functions
  .region('us-central1')
  .https.onRequest(async (...args) => {
    await promiseApplicationReady;
    server(...args);
  });
