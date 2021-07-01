import * as admin from "firebase-admin";

admin.initializeApp();

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const users = require("./users");
