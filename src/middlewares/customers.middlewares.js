import connection from "../database/database.js";
import { StatusCodes } from "http-status-codes";
import { customerSchema } from "../schemas/customer.schema.js";

async function customerDataValidation(req, res, next) {
  const { name, phone, cpf, birthday } = req.body;

  const validation = customerSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    const error = validation.error.details.map((detail) => detail.message);
    return res.status(StatusCodes.BAD_REQUEST).send(error);
  }

  res.locals.customerBody = req.body;
  next();
}

async function customerRegisteredValidation(req, res, next) {
  const { cpf } = res.locals.customerBody;

  try {
    const customerCPF = (
      await connection.query(`SELECT * FROM customers WHERE cpf = $1;`, [cpf])
    ).rows[0];

    if (customerCPF) {
      return res.status(StatusCodes.CONFLICT).send("CPF is already in use");
    }

    next();
  } catch (err) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

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

async function customerCPFValidation(req, res, next) {
  const { id } = req.params;
  const { cpf } = res.locals.customerBody;

  try {
    const customerCPF = (
      await connection.query("SELECT * FROM customers WHERE cpf = $1;", [cpf])
    ).rows[0];

    if (customerCPF.id != id) {
      console.log(customerCPF.id);
      console.log(id);
      return res.sendStatus(StatusCodes.FORBIDDEN);
    }
    next();
  } catch (err) {
    // res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
  }
}

export {
  customerDataValidation,
  customerRegisteredValidation,
  customerIdValidation,
  customerCPFValidation,
};
