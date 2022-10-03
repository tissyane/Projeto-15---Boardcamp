import express from "express";
import {
  createCustomer,
  findCustomerID,
  listCustomers,
  updateCustomer,
} from "../controllers/customers.controller.js";
import {
  customerCPFValidation,
  customerDataValidation,
  customerIdValidation,
  customerRegisteredValidation,
} from "../middlewares/customers.middlewares.js";

const router = express.Router();
router.post(
  "/customers",
  customerDataValidation,
  customerRegisteredValidation,
  createCustomer
);
router.get("/customers", listCustomers);
router.get("/customers/:id", customerIdValidation, findCustomerID);
router.put(
  "/customers/:id",
  customerDataValidation,
  customerIdValidation,
  customerCPFValidation,
  updateCustomer
);

export default router;
