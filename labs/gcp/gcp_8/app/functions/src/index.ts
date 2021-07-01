import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const test = functions.https.onRequest((_request, response) => {
  response.json(functions.config().admin.uid);
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const users = require("./users");
