import { Router } from "express";
import * as categoryController from "../controllers/category.controller";

const router = Router();
router.get("/", categoryController.list);
router.post("/", categoryController.create);
router.get("/:id", categoryController.getById);

export default router;
