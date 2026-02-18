import { Router } from "express";
import { createCategoryController } from "../controllers/category.post";
import { getCategoriesController } from "../controllers/category.get";

const router = Router();

router.post("/", createCategoryController);
router.get("/", getCategoriesController);

export default router;
