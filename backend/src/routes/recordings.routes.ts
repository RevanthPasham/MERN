import { Router } from "express";
import {
  handleUpload,
  handleList,
  handleGet,
  uploadRecordingsMulter,
  RecordingsUploadRequest,
} from "../controllers/recordings.controller";
import { optionalAuth } from "../middleware/auth";

const router = Router();

router.get("/", optionalAuth, handleList);
router.get("/:id", optionalAuth, handleGet);
router.post("/upload", optionalAuth, uploadRecordingsMulter, (req, res) =>
  handleUpload(req as RecordingsUploadRequest, res)
);

export default router;
