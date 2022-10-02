import connection from "../database/database.js";
import { StatusCodes } from "http-status-codes";
import { categorySchema } from "../schemas/category.schema.js";

async function createCategoryValidation(req, res, next) {
  const { name } = req.body;

  const validation = categorySchema.validate({ name }, { abortEarly: false });

  if (validation.error) {
    const error = validation.error.details.map((detail) => detail.message);
    return res.status(StatusCodes.BAD_REQUEST).send(error);
  }

  try {
    const category = await connection.query(
      "SELECT * FROM categories WHERE name = $1;",
      [name]
    );

    if (category.rows[0]) {
      return res
        .status(StatusCodes.CONFLICT)
        .send("Category name already exists");
    }
    res.locals.categoryName = name;
  } catch (err) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }

  next();
}

export { createCategoryValidation };
