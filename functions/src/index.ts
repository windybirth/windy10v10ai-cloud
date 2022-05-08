import * as functions from "firebase-functions";
import * as express from "express";
import * as member from "./member";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
const app: express.Express = express();
const windyExpress: express.Express = express();

app.get("/api", (request, response) => {
  console.log("Clinet query is");
  console.log(request.query);

  const ipAddress = request.headers["x-forwarded-for"] ||
    request.connection.remoteAddress;
  console.log(`Clinet IP is ${ipAddress}`);
  response.json({message: "API-GET-SUCCESS"});
});

app.get("/api/members", (request, response) => {
  const members = member.getMembersSteamId();
  response.json(members);
});

app.get("/api/members/all", async (request, response) => {
  const members = await member.getMemberSteamIdAll();
  console.log("Clinet query is");
  console.log(request.query);
  const ipAddress = request.headers["x-forwarded-for"] ||
    request.connection.remoteAddress;
  console.log(`Clinet IP is ${ipAddress}`);
  response.json(members);
});

export const api = functions.https.onRequest(app);

windyExpress.get("/init", (request, response) => {
  member.initMemberSteamId();
  response.json({message: "API-INIT-SUCCESS"});
});

windyExpress.post("/member/add", (request, response) => {
  member.addMemberSteamId(request.body.steamId, request.body.subscribeMonth);
  response.json({message: "API-POST-SUCCESS"});
});

windyExpress.get("/member", async (request, response) => {
  const steamId:number = parseInt(request.query.steamId+"");
  const res = await member.getMemberSteamId(steamId);
  response.json(res);
});

export const windy = functions.https.onRequest(windyExpress);
