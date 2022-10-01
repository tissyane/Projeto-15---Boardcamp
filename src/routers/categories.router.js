import express from "express";
import {
  listCategories,
  createCategory,
} from "../controllers/categories.controller.js";
import { createCategoryValidation } from "../middlewares/categories.middleware.js";

const router = express.Router();

router.get("/categories", listCategories);
router.post("/categories", createCategoryValidation, createCategory);

export default router;
