# Stage-2 Recording Architecture

This document describes the Stage-2 recording system for the interview platform.

## Overview

Two recording modes:

1. **Mock Interview** – AI + User with separate audio streams (≈99% speaker separation)
2. **Tab Recording** – Multi-speaker diarization via pyannote

## Architecture

| Layer | Tech |
|-------|------|
| Frontend | React / TypeScript |
| Backend | Node.js / TypeScript |
| Speech processing | Python microservice (pyannote + Whisper) |
| Storage | Cloudflare R2 |
| Audio | FFmpeg, OpenAI Whisper API |

## Mode 1 — Mock Interview

### Frontend Recording

- **Screen**: `getDisplayMedia({ video: true, audio: false })` → `screen.webm`
- **Mic**: `getUserMedia({ audio: true })` → `mic.webm`
- **AI**: `aiAudioElement.captureStream()` → `ai.webm`

Three streams are recorded separately and uploaded.

### Backend Pipeline

1. `mic.webm`, `ai.webm` → FFmpeg → `mic.wav`, `ai.wav`
2. OpenAI Whisper API → transcripts
3. Merge by timestamp (User vs AI)
4. Upload to R2: `recordings/mock/<sessionId>/`

## Mode 2 — Tab Recording

### Frontend

- Button: **Record Tab**
- `getDisplayMedia({ video: true, audio: true })` → single `recording.webm`
- User chooses tab / window / full screen

### Backend Pipeline

1. Extract audio from `recording.webm` → `audio.wav`
2. Call Python service `/diarize` with `audio.wav`
3. Python: Whisper + pyannote → Speaker 1, 2, 3…
4. Upload to R2: `recordings/tabs/<sessionId>/`

## API

### POST /api/recordings/upload

`multipart/form-data`:

- `recordingType`: `mock_interview` | `tab_recording`
- **Mock**: `screen`, `mic`, `ai` (each `.webm`)
- **Tab**: `recording` (`.webm`)

### GET /api/recordings

List recordings (optionally filtered by user).

### GET /api/recordings/:id

Get a single recording with transcript.

## Environment Variables

### Backend

```env
# R2 Storage (Cloudflare)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=recordings
R2_PUBLIC_URL=https://your-r2-public-domain.com

# Whisper (OpenAI)
OPENAI_API_KEY=

# Diarization Python service
PYTHON_DIARIZATION_URL=http://localhost:8000

# Temp uploads
UPLOAD_DIR=./uploads/recordings
```

### Python Service

```env
HUGGINGFACE_TOKEN=
```

## Setup

1. **FFmpeg** – Install system-wide.
2. **Backend** – Run migration:
   ```bash
   cd backend && npm run db:migrate
   ```
3. **Python service** – Accept pyannote terms on HuggingFace, create token:
   ```bash
   cd python-service && pip install -r requirements.txt
   HUGGINGFACE_TOKEN=… uvicorn main:app --host 0.0.0.0 --port 8000
   ```
4. **Frontend-interview**:
   ```bash
   cd frontend-interview && npm install && npm run dev
   ```

## R2 Folder Layout

```
recordings/
  mock/<sessionId>/
    screen.webm
    mic.webm
    ai.webm
  tabs/<sessionId>/
    recording.webm
```
