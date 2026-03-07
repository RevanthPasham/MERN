import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface TranscriptSegment {
  speaker: string;
  start: number;
  end: number;
  text: string;
}

export interface RecordingDto {
  id: string;
  sessionId: string;
  recordingType: "mock_interview" | "tab_recording";
  videoUrl: string;
  micUrl?: string | null;
  aiUrl?: string | null;
  transcript: TranscriptSegment[];
  summary: string | null;
  durationSeconds: number | null;
  createdAt: string;
}

export async function listRecordings(): Promise<RecordingDto[]> {
  const { data } = await api.get<{ success: boolean; recordings: RecordingDto[] }>(
    "/recordings"
  );
  return data?.recordings ?? [];
}

export async function getRecording(id: string): Promise<RecordingDto | null> {
  try {
    const { data } = await api.get<{ success: boolean; recording: RecordingDto }>(
      `/recordings/${id}`
    );
    return data?.recording ?? null;
  } catch {
    return null;
  }
}

export async function uploadRecordings(
  formData: FormData
): Promise<{ success: boolean; recording: RecordingDto }> {
  const { data } = await api.post<{ success: boolean; recording: RecordingDto }>(
    "/recordings/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 120000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    }
  );
  return data;
}
