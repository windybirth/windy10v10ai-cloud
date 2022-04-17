import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
admin.initializeApp();

export const getMembers = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  functions.logger.info("Request Info: ", {request});
  response.send("Hello from Firebase!");
});
