import { Router } from "express";
import * as bannerController from "../controllers/banner.controller";

const router = Router();
router.get("/", bannerController.list);

export default router;
