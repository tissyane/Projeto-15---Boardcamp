import connection from "../database/database.js";
import { StatusCodes } from "http-status-codes";

async function listGames(req, res) {
  const name = req.query.name;
  try {
    if (name) {
      const filteredGames = await connection.query(
        `SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id WHERE games.name ILIKE ($1 || '%');`,
        [name]
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

async function createGame(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } =
    res.locals.gameData;
  const formatedName = name.toLowerCase().trim();
  try {
    await connection.query(
      'INSERT INTO games (name,image,"stockTotal","categoryId","pricePerDay") VALUES ($1,$2,$3,$4,$5);',
      [formatedName, image, stockTotal, categoryId, pricePerDay]
    );
    res.sendStatus(StatusCodes.CREATED);
  } catch (err) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export { listGames, createGame };
