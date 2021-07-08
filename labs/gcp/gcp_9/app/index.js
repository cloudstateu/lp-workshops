if (process.env.K_SERVICE) {
  require('@google-cloud/debug-agent').start({ serviceContext: { enableCanary: true } });
}

const express = require("express");
const morgan = require('morgan');
const { Client } = require("pg");
const axios = require('axios');

const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ status: 'ok', data: { env: process.env } });
});

// GET /greet?name=Joe
app.get("/greet", (req, res) => {
  const name = req.query.name || 'Anonymous';
  res.send(`Hello, ${name}!`);
});

app.get("/winners", async (_, res, next) => {
  try {
    const dbSocketPath = process.env.DB_SOCKET_PATH || '/cloudsql';

    const client = new Client({
      user: "postgres",
      password: "password123",
      database: "lp_test",
      host: `${dbSocketPath}/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
      port: 5432,
    });

    await client.connect();
    const results = await client.query("SELECT * FROM winners");
    await client.end();

    res.json({ status: "ok", data: results.rows });
  } catch (err) {
    next(err);
  }
});

app.get("/external", async (_, res, next) => {
  try {
    const result = await axios.get('https://jsonplaceholder.typicode.com/todos/1')
    console.log(`Received result`, result.data);
    res.json({ staus: 'ok', data: result.data });
  } catch (err) {
    next(err);
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});