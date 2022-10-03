import connection from "../database/database.js";
import { StatusCodes } from "http-status-codes";
import { rentalSchema } from "../schemas/rental.schema.js";

async function rentalDataValidation(req, res, next) {
  const { customerId, gameId, daysRented } = req.body;
  const validation = rentalSchema.validate(
    { customerId, gameId, daysRented },
    { abortEarly: false }
  );
  if (validation.error) {
    const error = validation.error.details.map((detail) => detail.message);
    return res.status(StatusCodes.BAD_REQUEST).send(error);
  }
  res.locals.rentalBody = { customerId, gameId, daysRented };
  next();
}

async function rentalIDValidation(req, res, next) {
  const { customerId } = res.locals.rentalBody;

  try {
    const customer = await connection.query(
      "SELECT * FROM customers WHERE id = $1;",
      [customerId]
    );

    if (!customer.rows[0]) {
      return res.status(StatusCodes.NOT_FOUND).send("Customer Not Found");
    }

    res.locals.customer = customer;
    next();
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
  }
}

async function rentalGameValidation(req, res, next) {
  const { gameId } = res.locals.rentalBody;

  try {
    const game = await connection.query("SELECT * FROM games WHERE id = $1;", [
      gameId,
    ]);

    if (!game.rows[0]) {
      return res.status(StatusCodes.NOT_FOUND).send("Game Not Found");
    }

    res.locals.game = game;
    next();
  } catch (err) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

// export { rentalDataValidation, rentalIDValidation, rentalGameValidation };
export { rentalDataValidation, rentalIDValidation, rentalGameValidation };
