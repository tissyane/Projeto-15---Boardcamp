import connection from "../database/database.js";
import { StatusCodes } from "http-status-codes";

async function listGames(req, res) {
  const name = req.query.name;
  try {
    if (name) {
      const filteredGames = await connection.query(
        `SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id WHERE LOWER (games.name) LIKE $1;`,
        [`${name.toLowerCase()}%`]
      );
      return res.status(StatusCodes.OK).send(filteredGames.rows);
    }
    const games = await connection.query(
      'SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id;'
    );
    res.status(StatusCodes.OK).send(games.rows);
  } catch (err) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export { listGames };
