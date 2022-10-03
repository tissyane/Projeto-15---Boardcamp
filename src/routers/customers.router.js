import express from "express";
import {
  createCustomer,
  findCustomerID,
  listCustomers,
  updateCustomer,
} from "../controllers/customers.controller.js";
import { customerCpfValidation } from "../middlewares/customers.middlewares/customerCPF.middleware.js";
import { customerDataValidation } from "../middlewares/customers.middlewares/customerData.middleware.js";
import { customerIdValidation } from "../middlewares/customers.middlewares/customerId.middleware.js";

const router = express.Router();

router.get("/customers", listCustomers);
router.get("/customers/:id", customerIdValidation, findCustomerID);
router.post(
  "/customers",
  customerDataValidation,
  customerCpfValidation,
  createCustomer
);
router.put(
  "/customers/:id",
  customerDataValidation,
  customerIdValidation,
  customerCpfValidation,
  updateCustomer
);

export default router;
