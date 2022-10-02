import express from "express";
import { listCustomers } from "../controllers/customers.controller.js";

const router = express.Router();

router.get("/customers", listCustomers);

export default router;
