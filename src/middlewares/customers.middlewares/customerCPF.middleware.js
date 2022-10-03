import connection from "../../database/database.js";
import { StatusCodes } from "http-status-codes";

async function customerCpfValidation(req, res, next) {
  const { cpf } = req.body;
  const { id } = req.params;
  try {
    const customerCPF = (
      await connection.query(`SELECT * FROM customers WHERE cpf = $1;`, [cpf])
    ).rows[0];

    if (id) {
      if (customerCPF.cpf === cpf) {
        return next();
      }
    }
    if (customerCPF) {
      return res.status(StatusCodes.CONFLICT).send("CPF is already in use");
    }
    next();
  } catch (err) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export { customerCpfValidation };
