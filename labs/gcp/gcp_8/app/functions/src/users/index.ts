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

    console.log(id.toString());

    const ref = db.collection("users").doc(id.toString());
    await ref.update({status});

    return response.sendStatus(200);
  } catch (err) {
    functions.logger.error(err);
    return response.sendStatus(500);
  }
});

export const status = functions.https.onRequest(app);

export const list = functions.https.onRequest((request, response) => {
  const ref = db.collection("users");

  ref.get()
      .then((data) => data.docs.map((doc) => {
        const data = doc.data();

        return {
          ...data,
          id: doc.id,
        };
      }))
      .then((docs) => response.json(docs));
});

export const notify = functions.firestore
    .document("/users/{userId}")
    .onUpdate(async (snap) => {
      const oldStatus = snap.before.get("status");
      const newStatus = snap.after.get("status");

      // eslint-disable-next-line max-len
      functions.logger.info(`Status changed. Old status: ${oldStatus}. New status: ${newStatus}.`);
    });
