import connection from "../database/database.js";
import { StatusCodes } from "http-status-codes";

async function listCategories(req, res) {
  try {
    const categories = await connection.query("SELECT * FROM categories;");
    res.status(StatusCodes.OK).send(categories.rows);
  } catch (err) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function createCategory(req, res) {
  const categoryName = res.locals.categoryName;

  try {
    await connection.query("INSERT INTO categories (name) VALUES ($1);", [
      categoryName,
    ]);
    res.sendStatus(StatusCodes.CREATED);
  } catch (err) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export { listCategories, createCategory };
