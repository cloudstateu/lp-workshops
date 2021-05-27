// ############
// #          #
// # Firebase #
// #          #
// ############

const firebase = require('firebase/app');
require('firebase/firestore');

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
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
    const items = snapshot.docs.map(item => { return { id: item.id, ...item.data() }});
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
const bodyParser = require('body-parser');
const morgan = require("morgan");

const app = express();
app.use(bodyParser.json());
app.use(morgan("dev"));

app.get("/", async (_, res) => {
  let ref = db.collection("users");
  const data = await ref.get();
  const users = data.docs.map(doc => { return {...doc.data(), id: doc.id} });

  res.json({ status: "ok", data: users });
});

// ********************************************** //
//                                                //
// Tu wklej kod dla metody POST /users            //
//                                                //
// ********************************************** //


app.use((err, _, res, next) => {
  console.log("Handling uncaught error");
  console.error(err.stack);
  res.status(500).json({ status: "fail", error: err.message });
});

app.listen(8080, () =>
  console.log("Application is listenning at port 8080...")
);
