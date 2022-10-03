import express from "express";
import {
  listCategories,
  createCategory,
} from "../controllers/categories.controller.js";
import { createCategoryValidation } from "../middlewares/categories.middleware.js";

const router = express.Router();

router.post("/categories", createCategoryValidation, createCategory);
router.get("/categories", listCategories);

export default router;
