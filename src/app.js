const express = require("express");
const mainRouter = require("../src/routers/router.js");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Health OK" });
});

app.use("/api", mainRouter);

module.exports = app;
