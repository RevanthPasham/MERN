import { Response } from "express";
import multer from "multer";
import * as path from "path";
import * as fs from "fs";
import { AuthRequest } from "../middleware/auth";
import { uploadRecordings, listRecordings, getRecording } from "../services/recordings.service";
import type { RecordingType } from "../services/recordings.service";
import { AppError } from "../utils/errors";

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads", "recordings");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(UPLOAD_DIR, "temp");
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".webm";
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB max
});

/** Multer accepts both mock interview (screen/mic/ai) and tab recording (recording) */
export const uploadRecordingsMulter = upload.fields([
  { name: "screen", maxCount: 1 },
  { name: "mic", maxCount: 1 },
  { name: "ai", maxCount: 1 },
  { name: "recording", maxCount: 1 },
]);

export async function handleUpload(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId ?? null;
  const recordingType = (req.body?.recordingType as RecordingType) || "mock_interview";

  if (recordingType === "mock_interview") {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    if (!files?.screen?.[0] || !files?.mic?.[0] || !files?.ai?.[0]) {
      throw new AppError("Mock interview requires screen.webm, mic.webm, ai.webm", 400);
    }
    const result = await uploadRecordings(
      {
        screen: files.screen[0],
        mic: files.mic[0],
        ai: files.ai[0],
      },
      "mock_interview",
      userId
    );
    res.status(201).json({ success: true, recording: result });
    return;
  }

  if (recordingType === "tab_recording") {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const file = files?.recording?.[0];
    if (!file) throw new AppError("Tab recording requires recording.webm", 400);
    const result = await uploadRecordings(
      { recording: file },
      "tab_recording",
      userId
    );
    res.status(201).json({ success: true, recording: result });
    return;
  }

  throw new AppError(`Unknown recording type: ${recordingType}`, 400);
}

export async function handleList(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId ?? null;
  const recordings = await listRecordings(userId);
  res.json({ success: true, recordings });
}

export async function handleGet(req: AuthRequest, res: Response): Promise<void> {
  const id = req.params.id;
  const userId = req.userId ?? null;
  const recording = await getRecording(id, userId);
  if (!recording) {
    throw new AppError("Recording not found", 404);
  }
  res.json({ success: true, recording });
}
