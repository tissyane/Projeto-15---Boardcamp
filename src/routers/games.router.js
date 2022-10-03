import express from "express";
import { listGames, createGame } from "../controllers/games.controller.js";
import { createGameValidation } from "../middlewares/games.middleware.js";

const router = express.Router();

router.post("/games", createGameValidation, createGame);
router.get("/games", listGames);

export default router;
