// ############
// #          #
// # Firebase #
// #          #
// ############

const firebase = require('firebase/app');
require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAdLN5BvJcZy7ws8p6p2AE83hYZt9ilMgE",
  authDomain: "training-maciejborowy-3.firebaseapp.com",
  projectId: "training-maciejborowy-3",
  storageBucket: "training-maciejborowy-3.appspot.com",
  messagingSenderId: "611511646697",
  appId: "1:611511646697:web:18f9597b770c15c9e17378"
};

firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

// ********************************************** //
//                                                //
// Tu wklej kod pozwalający na live reload danych //
//                                                //
// ********************************************** //

const ref = (db).collection("users");
ref.onSnapshot(
  snapshot => {
    const items = snapshot.docs.map(item => item.data());
    console.log(items);
  },
  e => {
    console.error('Error', e);
  }
);

// ###########
// #         #
// # Express #
// #         #
// ###########

const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(morgan("dev"));

app.get("/", async (_, res) => {
  let ref = db.collection("users");
  const data = await ref.get();
  const users = data.docs.map(doc => { return {...doc.data(), id: doc.id} });

  res.json({ status: "ok", data: users });
});

app.use((err, _, res, next) => {
  console.log("Handling uncaught error");
  console.error(err.stack);
  res.status(500).json({ status: "fail", error: err.message });
});

app.listen(8080, () =>
  console.log("Application is listenning at port 8080...")
);
