import { randomUUID } from "crypto";
import * as path from "path";
import * as fs from "fs";
import FormData from "form-data";
import axios from "axios";
import { Recording } from "../db/models/recording.model";
import type { TranscriptSegment } from "../db/models/recording.model";
import { uploadToR2 } from "./r2.service";
import { webmToWav, getDurationSeconds } from "../utils/ffmpeg";
import { transcribeWavWithSegments } from "./whisper.service";

const PYTHON_DIARIZATION_URL =
  process.env.PYTHON_DIARIZATION_URL || "http://localhost:8000";
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads", "recordings");

export type RecordingType = "mock_interview" | "tab_recording";

interface UploadedFiles {
  screen?: Express.Multer.File;
  mic?: Express.Multer.File;
  ai?: Express.Multer.File;
  recording?: Express.Multer.File;
}

interface MockInterviewUploadResult {
  id: string;
  sessionId: string;
  recordingType: "mock_interview";
  videoUrl: string;
  transcript: TranscriptSegment[];
  summary: string | null;
  durationSeconds: number | null;
  createdAt: string;
}

interface TabRecordingUploadResult {
  id: string;
  sessionId: string;
  recordingType: "tab_recording";
  videoUrl: string;
  transcript: TranscriptSegment[];
  summary: string | null;
  durationSeconds: number | null;
  createdAt: string;
}

function ensureUploadDir(): void {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

async function processMockInterview(
  files: UploadedFiles,
  sessionId: string,
  userId: string | null
): Promise<MockInterviewUploadResult> {
  ensureUploadDir();
  const workDir = path.join(UPLOAD_DIR, sessionId);
  fs.mkdirSync(workDir, { recursive: true });

  const screenFile = files.screen;
  const micFile = files.mic;
  const aiFile = files.ai;

  if (!screenFile || !micFile || !aiFile) {
    throw new Error("Mock interview requires screen.webm, mic.webm, ai.webm");
  }

  // Convert mic.webm and ai.webm to wav
  const micWav = path.join(workDir, "mic.wav");
  const aiWav = path.join(workDir, "ai.wav");

  await webmToWav(micFile.path, micWav);
  await webmToWav(aiFile.path, aiWav);

  // Transcribe with Whisper
  const micSegments = await transcribeWavWithSegments(micWav);
  const aiSegments = await transcribeWavWithSegments(aiWav);

  // Merge and sort by timestamp
  const micWithSpeaker = micSegments.map((s) => ({ ...s, speaker: "User" }));
  const aiWithSpeaker = aiSegments.map((s) => ({ ...s, speaker: "AI" }));
  const merged: TranscriptSegment[] = [...micWithSpeaker, ...aiWithSpeaker].sort(
    (a, b) => a.start - b.start
  );

  // Duration from video/screen
  let durationSeconds: number | null = null;
  try {
    durationSeconds = Math.round(await getDurationSeconds(screenFile.path));
  } catch {
    /* ignore */
  }

  // Upload to R2
  const screenBuffer = fs.readFileSync(screenFile.path);
  const micBuffer = fs.readFileSync(micFile.path);
  const aiBuffer = fs.readFileSync(aiFile.path);

  const videoUrl = await uploadToR2(
    screenBuffer,
    "mock",
    sessionId,
    "screen.webm",
    "video/webm"
  );
  const micUrl = await uploadToR2(
    micBuffer,
    "mock",
    sessionId,
    "mic.webm",
    "audio/webm"
  );
  const aiUrl = await uploadToR2(
    aiBuffer,
    "mock",
    sessionId,
    "ai.webm",
    "audio/webm"
  );

  // Save recording
  const rec = await Recording.create({
    sessionId,
    userId,
    recordingType: "mock_interview",
    videoUrl,
    micUrl,
    aiUrl,
    transcript: merged,
    summary: null,
    durationSeconds,
  });

  // Cleanup temp files
  try {
    fs.rmSync(workDir, { recursive: true });
  } catch {
    /* ignore */
  }

  return {
    id: rec.id,
    sessionId: rec.sessionId,
    recordingType: "mock_interview",
    videoUrl: rec.videoUrl,
    transcript: rec.transcript || [],
    summary: rec.summary,
    durationSeconds: rec.durationSeconds,
    createdAt: rec.createdAt.toISOString(),
  };
}

async function callDiarizationService(audioPath: string): Promise<TranscriptSegment[]> {
  const form = new FormData();
  form.append("file", fs.createReadStream(audioPath), {
    filename: "audio.wav",
    contentType: "audio/wav",
  });

  const response = await axios.post<TranscriptSegment[]>(
    `${PYTHON_DIARIZATION_URL}/diarize`,
    form,
    {
      headers: form.getHeaders(),
      timeout: 120000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    }
  );

  return response.data || [];
}

async function processTabRecording(
  file: Express.Multer.File,
  sessionId: string,
  userId: string | null
): Promise<TabRecordingUploadResult> {
  ensureUploadDir();
  const workDir = path.join(UPLOAD_DIR, sessionId);
  fs.mkdirSync(workDir, { recursive: true });

  // Extract audio from webm for diarization
  const audioWav = path.join(workDir, "audio.wav");
  await webmToWav(file.path, audioWav);

  // Call Python diarization service
  let transcript: TranscriptSegment[] = [];
  try {
    transcript = await callDiarizationService(audioWav);
  } catch (err) {
    console.error("Diarization service failed, using Whisper only:", err);
    const segments = await transcribeWavWithSegments(audioWav);
    transcript = segments.map((s) => ({ ...s, speaker: "Speaker 1" }));
  }

  let durationSeconds: number | null = null;
  try {
    durationSeconds = Math.round(await getDurationSeconds(file.path));
  } catch {
    /* ignore */
  }

  const buffer = fs.readFileSync(file.path);
  const videoUrl = await uploadToR2(
    buffer,
    "tabs",
    sessionId,
    "recording.webm",
    "video/webm"
  );

  const rec = await Recording.create({
    sessionId,
    userId,
    recordingType: "tab_recording",
    videoUrl,
    micUrl: null,
    aiUrl: null,
    transcript,
    summary: null,
    durationSeconds,
  });

  try {
    fs.rmSync(workDir, { recursive: true });
  } catch {
    /* ignore */
  }

  return {
    id: rec.id,
    sessionId: rec.sessionId,
    recordingType: "tab_recording",
    videoUrl: rec.videoUrl,
    transcript: rec.transcript || [],
    summary: rec.summary,
    durationSeconds: rec.durationSeconds,
    createdAt: rec.createdAt.toISOString(),
  };
}

export async function uploadRecordings(
  files: UploadedFiles,
  recordingType: RecordingType,
  userId: string | null
): Promise<MockInterviewUploadResult | TabRecordingUploadResult> {
  const sessionId = randomUUID();

  if (recordingType === "mock_interview") {
    return processMockInterview(files, sessionId, userId);
  }

  if (recordingType === "tab_recording") {
    const file = files.recording;
    if (!file) throw new Error("Tab recording requires recording.webm");
    return processTabRecording(file, sessionId, userId);
  }

  throw new Error(`Unknown recording type: ${recordingType}`);
}

export async function listRecordings(userId: string | null): Promise<
  Array<{
    id: string;
    sessionId: string;
    recordingType: RecordingType;
    videoUrl: string;
    transcript: TranscriptSegment[] | null;
    summary: string | null;
    durationSeconds: number | null;
    createdAt: string;
  }>
> {
  const where = userId ? { userId } : {};
  const rows = await Recording.findAll({
    where,
    order: [["createdAt", "DESC"]],
  });

  return rows.map((r) => ({
    id: r.id,
    sessionId: r.sessionId,
    recordingType: r.recordingType as RecordingType,
    videoUrl: r.videoUrl,
    transcript: r.transcript,
    summary: r.summary,
    durationSeconds: r.durationSeconds,
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function getRecording(
  id: string,
  userId?: string | null
): Promise<{
  id: string;
  sessionId: string;
  recordingType: RecordingType;
  videoUrl: string;
  micUrl: string | null;
  aiUrl: string | null;
  transcript: TranscriptSegment[] | null;
  summary: string | null;
  durationSeconds: number | null;
  createdAt: string;
} | null> {
  const where: Record<string, unknown> = { id };
  if (userId) where.userId = userId;

  const rec = await Recording.findOne({ where });
  if (!rec) return null;

  return {
    id: rec.id,
    sessionId: rec.sessionId,
    recordingType: rec.recordingType as RecordingType,
    videoUrl: rec.videoUrl,
    micUrl: rec.micUrl,
    aiUrl: rec.aiUrl,
    transcript: rec.transcript,
    summary: rec.summary,
    durationSeconds: rec.durationSeconds,
    createdAt: rec.createdAt.toISOString(),
  };
}
