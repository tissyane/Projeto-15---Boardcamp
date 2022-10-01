import express from "express";
import {
  listCategories,
  //   createCategories,
} from "../controllers/categories.controller.js";

const router = express.Router();

router.get("/categories", listCategories);
// router.post("/categories", createCategories);

export default router;
