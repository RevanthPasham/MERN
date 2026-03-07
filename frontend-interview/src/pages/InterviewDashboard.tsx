import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMockInterviewRecorder } from "../hooks/useMockInterviewRecorder";
import { useTabRecorder } from "../hooks/useTabRecorder";
import { listRecordings, uploadRecordings } from "../api/client";
import type { RecordingDto } from "../api/client";

export default function InterviewDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const showHistory = location.pathname === "/history";

  const [recordings, setRecordings] = useState<RecordingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const aiAudioRef = useRef<HTMLAudioElement | null>(null);

  const handleMockStop = async (blobs: { screen: Blob; mic: Blob; ai: Blob } | null) => {
    if (!blobs) return;
    setUploadError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("recordingType", "mock_interview");
      formData.append("screen", blobs.screen, "screen.webm");
      formData.append("mic", blobs.mic, "mic.webm");
      formData.append("ai", blobs.ai, "ai.webm");
      const { recording } = await uploadRecordings(formData);
      setRecordings((prev) => [recording, ...prev]);
      navigate(`/recording/${recording.id}`);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : String(err));
    } finally {
      setUploading(false);
    }
  };

  const handleTabStop = async (blob: Blob | null) => {
    if (!blob) return;
    setUploadError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("recordingType", "tab_recording");
      formData.append("recording", blob, "recording.webm");
      const { recording } = await uploadRecordings(formData);
      setRecordings((prev) => [recording, ...prev]);
      navigate(`/recording/${recording.id}`);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : String(err));
    } finally {
      setUploading(false);
    }
  };

  const mockRecorder = useMockInterviewRecorder({
    getAiAudioElement: () => aiAudioRef.current,
    onStop: handleMockStop,
  });

  const tabRecorder = useTabRecorder({ onStop: handleTabStop });

  useEffect(() => {
    listRecordings()
      .then(setRecordings)
      .finally(() => setLoading(false));
  }, []);

  const isRecording = mockRecorder.isRecording || tabRecorder.isRecording;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">
          {showHistory ? "Recording History" : "Interview"}
        </h1>
        <p className="mt-1 text-slate-400">
          Mock interview or tab recording with speaker separation
        </p>
      </div>

      {!showHistory && (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => mockRecorder.start()}
            disabled={isRecording || uploading}
            className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            New Mock Interview
          </button>
          <button
            type="button"
            onClick={() => tabRecorder.start()}
            disabled={isRecording || uploading}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500 disabled:opacity-50"
          >
            Record Tab
          </button>
        </div>
      )}

      {(mockRecorder.error || tabRecorder.error || uploadError) && (
        <div className="rounded-lg border border-red-800 bg-red-950/50 p-3 text-red-300">
          {mockRecorder.error || tabRecorder.error || uploadError}
        </div>
      )}

      {isRecording && (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-amber-800 bg-amber-950/30 px-4 py-2">
          <span className="flex items-center gap-2 text-amber-200">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            Recording in progress…
          </span>
          <button
            type="button"
            onClick={() => {
              mockRecorder.isRecording && mockRecorder.stop();
              tabRecorder.isRecording && tabRecorder.stop();
            }}
            className="rounded bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-500"
          >
            Stop
          </button>
        </div>
      )}

      {uploading && (
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-slate-300">
          Uploading and processing…
        </div>
      )}

      {showHistory && (
        <div className="space-y-4">
          {loading ? (
            <p className="text-slate-400">Loading history…</p>
          ) : recordings.length === 0 ? (
            <p className="text-slate-400">No recordings yet.</p>
          ) : (
            <ul className="divide-y divide-slate-800">
              {recordings.map((r) => (
                <li key={r.id} className="py-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/recording/${r.id}`)}
                    className="flex w-full items-center justify-between text-left hover:bg-slate-800/50 rounded-lg px-3 py-2"
                  >
                    <div>
                      <span className="font-medium text-white capitalize">
                        {r.recordingType.replace("_", " ")}
                      </span>
                      <span className="ml-2 text-slate-400 text-sm">
                        {r.durationSeconds != null ? `${r.durationSeconds}s` : "—"}
                      </span>
                    </div>
                    <span className="text-slate-500 text-sm">
                      {new Date(r.createdAt).toLocaleString()}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Hidden audio element for AI playback capture - mount when mock interview active */}
      <audio ref={aiAudioRef} id="ai-audio-capture" playsInline className="hidden" />
    </div>
  );
}
