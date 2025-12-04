const { Router } = require("express");
const reservaController = require("../controllers/reservaController");

const reservaRouter = Router();

reservaRouter.get("/", reservaController.listAll);
reservaRouter.post("/add", reservaController.addReserva);
reservaRouter.post("/remove", reservaController.removeReserva);
reservaRouter.post("/", reservaController.getById);

module.exports = reservaRouter;
