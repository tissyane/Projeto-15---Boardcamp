import connection from "../database/database.js";
import { StatusCodes } from "http-status-codes";

async function listCustomers(req, res) {
  const cpf = req.query.cpf;
  try {
    if (cpf) {
      const filteredCustomers = await connection.query(
        "SELECT * FROM customers WHERE cpf LIKE ($1 || '%');",
        [cpf]
      );
      return res.status(StatusCodes.OK).send(filteredCustomers.rows);
    }
    const customers = await connection.query("SELECT * FROM customers;");
    res.status(StatusCodes.OK).send(customers.rows);
  } catch (err) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export { listCustomers };
