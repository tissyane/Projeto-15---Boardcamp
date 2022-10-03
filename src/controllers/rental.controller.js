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

export { createRental };
