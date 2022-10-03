import express from "express";
import {
  createRental,
  deleteRental,
  listRentals,
  returnRental,
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
  listRentals
);
router.delete("/rentals/:id", deleteRental);
router.post("/rentals/:id/return", returnRental);

export default router;
