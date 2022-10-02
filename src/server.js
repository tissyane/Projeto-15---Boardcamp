import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import categoriesRouter from "./routers/categories.router.js";
import gamesRouter from "./routers/games.router.js";
import customersRouter from "./routers/customers.router.js";

const server = express();
server.use(cors());
server.use(express.json());
server.use(categoriesRouter);
server.use(gamesRouter);
server.use(customersRouter);

const PORT = process.env.PORT;

server.get("/status", (req, res) => {
  res.send("Server on!");
});

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
