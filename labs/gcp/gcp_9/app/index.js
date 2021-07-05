const express = require("express");
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ status: 'ok', data: { some_value: process.env.SOME_VALUE || null } });
});

// GET /greet?name=Joe
app.get("/greet", (req, res) => {
  const name = req.query.name || 'Anonymous';
  res.send(`Hello, ${name}!`);
});

const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});