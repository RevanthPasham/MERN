import { Router } from "express";
import * as collectionController from "../controllers/collection.controller";

const router = Router();
router.get("/", collectionController.list);
router.get("/slug/:slug", collectionController.getBySlug);
router.post("/", collectionController.create);
router.get("/:id", collectionController.getById);

export default router;
