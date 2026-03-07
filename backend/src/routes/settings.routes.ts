import { Router } from "express";
import * as settingsController from "../controllers/settings.controller";

const router = Router();
router.get("/refund-policy", settingsController.getRefundPolicy);
export default router;
