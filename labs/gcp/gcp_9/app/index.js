const express = require("express");
const app = express();

// GET /greet?name=Joe
app.get("/greet", (req, res) => {
  const name = req.query.name || 'Anonymous';
  res.send(`Hello, ${name}!`);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});