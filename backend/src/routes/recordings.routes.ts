import { Router } from "express";
import {
  handleUpload,
  handleList,
  handleGet,
  uploadRecordingsMulter,
} from "../controllers/recordings.controller";
import { optionalAuth } from "../middleware/auth";

const router = Router();

router.get("/", optionalAuth, handleList);
router.get("/:id", optionalAuth, handleGet);
router.post("/upload", optionalAuth, uploadRecordingsMulter, handleUpload);

export default router;
