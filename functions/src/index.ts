import * as functions from "firebase-functions";
import * as express from "express";
import * as admin from "firebase-admin";
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
const app = express();

admin.initializeApp();

app.get("/api", (req, res) => {
  res.json({message: "API-GET-SUCCESS"});
});

app.get("/api/members", (request, response) => {
  const members = [
    // 开发贡献者
    136407523, 1194383041, 143575444, 314757913, 385130282,
    // 初始会员
    108208968,
    128984820,
    136668998,
    107451500,
    141315077,
    303743871,
    117417953,
    319701690,
    142964279,
    125049949,
    353885092,
    150252080,
    120921523,
    355472172,
    445801587,
    308320923,
    176061240,
    190540884,
    1009673688,
    342865365,
    // 测试
    916506173, // Arararara
    1059791959, // rerorerore
  ];
  response.json(members);
});

export const api = functions.https.onRequest(app);
