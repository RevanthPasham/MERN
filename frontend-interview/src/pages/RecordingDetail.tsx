import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getRecording } from "../api/client";
import type { RecordingDto, TranscriptSegment } from "../api/client";

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export default function RecordingDetail() {
  const { id } = useParams<{ id: string }>();
  const [recording, setRecording] = useState<RecordingDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(-1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const transcriptListRef = useRef<HTMLDivElement>(null);

  const isMockInterview = recording?.recordingType === "mock_interview";
  const showAiChat = isMockInterview;
  const showInsights = isMockInterview;
  const showTranscript = true;
  const showSummary = true;

  useEffect(() => {
    if (!id) return;
    getRecording(id)
      .then(setRecording)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !recording?.transcript?.length) return;

    const onTimeUpdate = () => {
      const t = video.currentTime;
      const idx = recording.transcript.findIndex((s) => t >= s.start && t <= s.end);
      if (idx !== activeIndex) setActiveIndex(idx >= 0 ? idx : -1);
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, [recording?.transcript, activeIndex]);

  useEffect(() => {
    if (activeIndex < 0 || !transcriptListRef.current) return;
    const el = transcriptListRef.current.children[activeIndex] as HTMLElement;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeIndex]);

  const seekTo = (segment: TranscriptSegment) => {
    const video = videoRef.current;
    if (video) video.currentTime = segment.start;
  };

  if (loading || !recording) {
    return (
      <div className="text-slate-400">
        {loading ? "Loading…" : "Recording not found."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to={isMockInterview ? "/" : "/history"} className="text-blue-400 hover:underline">
        ← Back
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Video player */}
        <div className="flex-1 min-w-0">
          <video
            ref={videoRef}
            src={recording.videoUrl}
            controls
            className="w-full rounded-lg bg-black"
          />
        </div>

        {/* Transcript panel */}
        <div className="w-full lg:w-96 flex flex-col rounded-lg border border-slate-700 bg-slate-900/50 overflow-hidden">
          <div className="border-b border-slate-700 px-4 py-2 font-medium text-white">
            Transcript
          </div>
          <div
            ref={transcriptListRef}
            className="flex-1 overflow-y-auto max-h-96 p-2 space-y-1"
          >
            {recording.transcript.length === 0 ? (
              <p className="text-slate-500 text-sm p-2">No transcript available.</p>
            ) : (
              recording.transcript.map((seg, i) => (
                <button
                  key={`${i}-${seg.start}`}
                  type="button"
                  onClick={() => seekTo(seg)}
                  className={`w-full text-left rounded px-3 py-2 transition-colors ${
                    activeIndex === i
                      ? "bg-emerald-900/50 text-emerald-200"
                      : "hover:bg-slate-800/50 text-slate-200"
                  }`}
                >
                  <span className="text-slate-500 text-xs font-mono mr-2">
                    {formatTime(seg.start)}
                  </span>
                  <span className="font-medium text-slate-400">{seg.speaker}</span>
                  <span className="ml-2">{seg.text}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {showSummary && recording.summary && (
        <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
          <h3 className="font-medium text-white mb-2">Summary</h3>
          <p className="text-slate-300 text-sm">{recording.summary}</p>
        </div>
      )}

      {/* Placeholders for disabled features in tab recording mode */}
      {isMockInterview && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {showAiChat && (
            <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
              <h3 className="font-medium text-white mb-2">AI Chat</h3>
              <p className="text-slate-500 text-sm">AI Chat available in mock interview mode.</p>
            </div>
          )}
          {showInsights && (
            <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
              <h3 className="font-medium text-white mb-2">Insights</h3>
              <p className="text-slate-500 text-sm">Insights available in mock interview mode.</p>
            </div>
          )}
        </div>
      )}

      {!isMockInterview && (
        <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
          <p className="text-slate-400 text-sm">
            Tab recording mode: AI Chat and Insights are disabled. Transcript and Video are shown.
          </p>
        </div>
      )}
    </div>
  );
}
