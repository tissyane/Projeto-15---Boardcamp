import express from "express";
import { listGames } from "../controllers/games.controller.js";

const router = express.Router();

router.get("/games", listGames);

export default router;
