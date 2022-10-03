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
    const customers = await connection.query(
      "SELECT * FROM customers ORDER BY id;"
    );
    res.status(StatusCodes.OK).send(customers.rows);
  } catch (err) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function findCustomerID(req, res) {
  const customer = res.locals.customer;
  try {
    res.status(StatusCodes.OK).send(customer.rows);
  } catch (err) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function createCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  try {
    await connection.query(
      "INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1,$2,$3,$4);",
      [name, phone, cpf, birthday]
    );
    res.sendStatus(StatusCodes.CREATED);
  } catch (err) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function updateCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;
  const { id } = req.params;

  try {
    await connection.query(
      `UPDATE customers SET name = '${name}', phone ='${phone}', birthday='${birthday}',cpf= '${cpf}' WHERE id = $1;`,
      [id]
    );
    res.sendStatus(StatusCodes.OK);
  } catch (err) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export { listCustomers, findCustomerID, createCustomer, updateCustomer };
