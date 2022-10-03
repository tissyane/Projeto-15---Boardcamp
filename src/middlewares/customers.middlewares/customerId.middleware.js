import connection from "../../database/database.js";

import { StatusCodes } from "http-status-codes";

async function customerIdValidation(req, res, next) {
  const { id } = req.params;

  try {
    const customer = await connection.query(
      `SELECT * FROM customers WHERE id = $1;`,
      [id]
    );
    if (!customer.rows[0]) {
      return res.status(StatusCodes.NOT_FOUND).send("Customer Not Found");
    }
    res.locals.customer = customer;
    next();
  } catch (err) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export { customerIdValidation };
