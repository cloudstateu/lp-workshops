import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";

const db = admin.firestore();

const app = express();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bodyParser = require("body-parser");
app.use((req, res, next) => {
  bodyParser.json()(req, res, next);
});

app.post("/update", async (request, response) => {
  try {
    functions.logger.info(request.body);

    const {id, status} = request.body;

    const ref = db.collection("activity").doc(id);
    await ref.update({status});

    return response.sendStatus(200);
  } catch (err) {
    functions.logger.error(err);
    return response.sendStatus(500);
  }
});

export const status = functions.https.onRequest(app);

export const notify = functions.https.onRequest((request, response) => {
  functions.logger.info(request.body);
  response.sendStatus(200);
});
