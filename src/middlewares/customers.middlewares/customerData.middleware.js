import { StatusCodes } from "http-status-codes";
import { customerSchema } from "../../schemas/customer.schema.js";

async function customerDataValidation(req, res, next) {
  const validation = customerSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    const error = validation.error.details.map((detail) => detail.message);
    return res.status(StatusCodes.BAD_REQUEST).send(error);
  }
  next();
}

export { customerDataValidation };
