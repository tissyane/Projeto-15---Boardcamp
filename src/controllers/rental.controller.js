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

async function listRentals(req, res) {
  const { customer, game } = res.locals;
  let rentals;

  try {
    if (!customer && game) {
      rentals = await connection.query(
        `SELECT rentals.*, json_build_object('id', customers.id, 'name', customers.name) AS customer, json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id WHERE rentals."gameId" = $1;`,
        [game.id]
      );
    } else if (customer && !game) {
      rentals = await connection.query(
        `SELECT rentals.*, json_build_object('id', customers.id, 'name', customers.name) AS customer, json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id WHERE rentals."customerId" = $1;`,
        [customer.id]
      );
    } else if (customer && game) {
      rentals = await connection.query(
        `SELECT rentals.*, json_build_object('id', customers.id, 'name', customers.name) AS customer, json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id WHERE rentals."customerId" = $1 AND rentals."gameId" = $2;`,
        [customer.id, game.id]
      );
    } else {
      rentals = await connection.query(
        `SELECT rentals.*, json_build_object('id', customers.id, 'name', customers.name) AS customer, json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id;`
      );
    }

    rentals.rows.forEach((rental) => {
      rental.rentDate = rental.rentDate.toISOString().split("T")[0];
    });

    res.status(StatusCodes.OK).send(rentals.rows);
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

async function returnRental(req, res) {
  const { id } = req.params;
  let today = dayjs().format("DD/MM/YY");

  let delayFee = 0;

  try {
    const rental = (
      await connection.query("SELECT * FROM rentals WHERE id = $1;", [id])
    ).rows[0];

    if (!rental) {
      return res.status(StatusCodes.NOT_FOUND).send("Rental Not Found");
    }

    const days = (today - rental.rentDate) / (1000 * 3600 * 24);

    if (days > rental.daysRented) {
      delayFee =
        (rental.originalPrice / rental.daysRented) * (days - rental.daysRented);
    }

    if (rental.returnDate) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Rent has already been finished");
    }

    await connection.query(
      'UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3;',
      [today, delayFee, rental.id]
    );

    res.sendStatus(StatusCodes.OK);
  } catch (err) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export { createRental, listRentals, deleteRental, returnRental };
