import * as functions from "firebase-functions";
import * as express from "express";
import {getMembersSteamId, getMemberSteamIdAll} from "./member";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
const app: express.Express = express();

app.get("/api", (request, response) => {
  console.log("Clinet query is");
  console.log(request.query);

  const ipAddress = request.headers["x-forwarded-for"] ||
    request.connection.remoteAddress;
  console.log(`Clinet IP is ${ipAddress}`);
  response.json({message: "API-GET-SUCCESS"});
});

app.get("/api/members", (request, response) => {
  const members = getMembersSteamId();
  response.json(members);
});

app.get("/api/members/all", async (request, response) => {
  const members = await getMemberSteamIdAll();
  console.log("Clinet query is");
  console.log(request.query);
  const ipAddress = request.headers["x-forwarded-for"] ||
    request.connection.remoteAddress;
  console.log(`Clinet IP is ${ipAddress}`);
  response.json(members);
});

app.post("/api/member", (request, response) => {
  // saveMemberSteamId(request.body.steamId);
  // response success
  response.json({message: "API-POST-SUCCESS"});
});

export const api = functions.https.onRequest(app);
