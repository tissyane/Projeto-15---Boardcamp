import connection from "../database/database.js";
import { StatusCodes } from "http-status-codes";

async function listCategories(req, res) {
  try {
    const categories = await connection.query("SELECT * FROM categories;");
    res.send(categories.rows);
  } catch (err) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export { listCategories };
