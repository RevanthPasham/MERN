import { Router } from "express";
import { getCollections } from "../controllers/collectionControllers";

const router = Router();

router.get("/collections", getCollections);
router.get("/Collections", getCollections);

export default router;
