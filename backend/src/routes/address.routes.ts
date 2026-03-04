import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import * as addressController from "../controllers/address.controller";

const router = Router();
router.use(requireAuth);

router.get("/", addressController.list);
router.post("/", addressController.create);
router.get("/:id", addressController.getById);
router.patch("/:id", addressController.update);
router.post("/:id/set-default", addressController.setDefault);
router.delete("/:id", addressController.remove);

export default router;
