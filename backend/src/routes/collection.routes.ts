import { Router } from "express";
import { createCollection, getCategories } from "../controllers/collection.controller";

const router = Router();

router.post("/", createCollection);
router.get("/:id/categories", getCategories);

export default router;
