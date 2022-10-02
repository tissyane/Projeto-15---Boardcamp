import connection from "../database/database.js";
import { StatusCodes } from "http-status-codes";
import { gameSchema } from "../schemas/game.schema.js";

async function createGameValidation(req, res, next) {
  const { name, categoryId } = req.body;
  const formatedName = name.toLowerCase();

  const validation = gameSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const error = validation.error.details.map((detail) => detail.message);
    return res.status(StatusCodes.BAD_REQUEST).send(error);
  }

  try {
    const category = await connection.query(
      `SELECT * FROM categories WHERE id = $1;`,
      [categoryId]
    );

    if (!category.rows[0]) {
      return res.sendStatus(StatusCodes.BAD_REQUEST);
    }

    const games = await connection.query(
      `SELECT * FROM games WHERE name = $1;`,
      [formatedName]
    );

    if (games.rows[0]) {
      return res.status(StatusCodes.CONFLICT).send("Game name already exists");
    }

    res.locals.gameData = req.body;
  } catch (err) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }

  next();
}

export { createGameValidation };
