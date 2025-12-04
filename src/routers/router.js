const { Router } = require("express");
const reservaRouter = require("./reservaRouter.js");

const mainRouter = Router();

mainRouter.use("/reserva", reservaRouter);

module.exports = mainRouter;
