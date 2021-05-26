const express = require("express");
const morgan = require("morgan");
const { Client } = require("pg");

const app = express();
app.use(morgan("dev"));

app.get("/", (_, res) => {
  res.json({ status: "ok", data: null });
});

app.get("/error", () => {
  throw new Error("This is sample error");
});

app.get("/winners", async (_, res, next) => {
  try {
    const client = new Client({
      user: "postgres",
      password: "password123",
      database: "lp_test",
      host: "34.107.91.166",
      port: 5432,
      statement_timeout: 5000,
      query_timeout: 5000,
      connectionTimeoutMillis: 5000,
      idle_in_transaction_session_timeout: 5000,
    });

    await client.connect();
    const results = await client.query("SELECT * FROM winners");
    await client.end();

    res.json({ status: "ok", data: results.rows });
  } catch (err) {
    next(err);
  }
});

app.use((err, _, res, next) => {
  console.log("Handling uncaught error");
  console.error(err.stack);
  res.status(500).json({ status: "fail", error: err.message });
});

app.listen(8080, () =>
  console.log("Application is listenning at port 8080...")
);
