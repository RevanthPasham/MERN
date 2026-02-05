import { Router } from "express";
import { getCollections } from "../controllers/collectionControllers";

const router = Router();

// Use lowercase, conventional REST path
router.get("/collections", getCollections);
// Also handle uppercase for compatibility
router.get("/Collections", getCollections);

export default router;
