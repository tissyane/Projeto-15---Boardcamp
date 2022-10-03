import express from "express";
import {
  createRental,
  deleteRental,
  getRentals,
} from "../controllers/rental.controller.js";
import {
  rentalDataValidation,
  rentalIDValidation,
  rentalGameValidation,
  customerIdRentalValidation,
  gameIdRentalValidation,
} from "../middlewares/rental.middleware.js";

const router = express.Router();

router.post(
  "/rentals",
  rentalDataValidation,
  rentalIDValidation,
  rentalGameValidation,
  createRental
);
router.get(
  "/rentals",
  customerIdRentalValidation,
  gameIdRentalValidation,
  getRentals
);
router.delete("/rentals/:id", deleteRental);

export default router;
