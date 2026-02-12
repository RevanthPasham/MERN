import { Router } from "express";
import {
  createCollection,
  getAllCollections,
  getCollectionById,
} from "../controllers/collection.controller";

const router = Router();

router.post("/", createCollection);
router.get("/", getAllCollections);
router.get("/:id", getCollectionById);

export default router;
