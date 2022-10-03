import express from "express";
import { createRental } from "../controllers/rental.controller.js";
import {
  rentalDataValidation,
  rentalIDValidation,
  rentalGameValidation,
} from "../middlewares/rental.middleware.js";

const router = express.Router();

router.post(
  "/rentals",
  rentalDataValidation,
  rentalIDValidation,
  rentalGameValidation,
  createRental
);

export default router;
