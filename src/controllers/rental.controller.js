import connection from "../database/database.js";
import { StatusCodes } from "http-status-codes";
import dayjs from "dayjs";

async function createRental(req, res) {
  const { customerId, gameId, daysRented } = res.locals.rentalBody;
  const { game } = res.locals;
  const originalPrice = Number(daysRented) * Number(game.rows[0].pricePerDay);
  const rentDate = dayjs().format("DD/MM/YY");
  const returnDate = null;
  const delayFee = null;

  try {
    await connection.query(
      'INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);',
      [
        customerId,
        gameId,
        rentDate,
        daysRented,
        returnDate,
        originalPrice,
        delayFee,
      ]
    );
    res.sendStatus(StatusCodes.CREATED);
  } catch (err) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function getRentals(req, res) {
  const { customer, game } = res.locals;
  let rentals;

  try {
    if (!customer && game) {
      rentals = (
        await connection.query(
          `SELECT rentals.*, json_build_object('id', customers.id, 'name', customers.name) AS customer, json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id WHERE rentals."gameId" = $1;`,
          [game.id]
        )
      ).rows;
    } else if (customer && !game) {
      rentals = (
        await connection.query(
          `SELECT rentals.*, json_build_object('id', customers.id, 'name', customers.name) AS customer, json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id WHERE rentals."customerId" = $1;`,
          [customer.id]
        )
      ).rows;
    } else if (customer && game) {
      rentals = (
        await connection.query(
          `SELECT rentals.*, json_build_object('id', customers.id, 'name', customers.name) AS customer, json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id WHERE rentals."customerId" = $1 AND rentals."gameId" = $2;`,
          [customer.id, game.id]
        )
      ).rows;
    } else {
      rentals = (
        await connection.query(
          `SELECT rentals.*, json_build_object('id', customers.id, 'name', customers.name) AS customer, json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id;`
        )
      ).rows;
    }

    rentals.forEach((rental) => {
      rental.rentDate = rental.rentDate.toISOString().split("T")[0];
    });
    res.status(StatusCodes.OK).send(rentals);
  } catch (err) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function deleteRental(req, res) {
  const { id } = req.params;

  try {
    const rentalId = await connection.query(
      `SELECT * FROM rentals WHERE id=$1;`,
      [id]
    );

    if (!rentalId.rows[0]) {
      return res.status(StatusCodes.NOT_FOUND).send("Rental Not Found");
    }

    const finishedRent = await connection.query(
      `SELECT * FROM rentals WHERE id=$1 AND "returnDate" IS NULL;`,
      [id]
    );

    if (!finishedRent.rows[0]) {
      return res.sendStatus(StatusCodes.BAD_REQUEST);
    }

    await connection.query(`DELETE FROM rentals WHERE id=$1;`, [id]);
    res.sendStatus(StatusCodes.OK);
  } catch (err) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
export { createRental, getRentals, deleteRental };
