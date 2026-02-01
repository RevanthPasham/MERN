import { Router } from "express";
import { getCollections } from "../controllers/CollectionControllers";

const router = Router();

router.get("/Collections", getCollections);

export default router;
