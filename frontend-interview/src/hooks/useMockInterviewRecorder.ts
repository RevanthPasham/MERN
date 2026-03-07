import { useState, useCallback, useRef } from "react";

export interface MockInterviewBlobs {
  screen: Blob;
  mic: Blob;
  ai: Blob;
}

export interface UseMockInterviewRecorderOptions {
  /** Callback to get AI audio element when recording starts (for captureStream) */
  getAiAudioElement?: () => HTMLAudioElement | null;
  onStart?: () => void;
  onStop?: (blobs: MockInterviewBlobs | null) => void;
}

export function useMockInterviewRecorder({
  getAiAudioElement,
  onStart,
  onStop,
}: UseMockInterviewRecorderOptions = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const screenRecorderRef = useRef<MediaRecorder | null>(null);
  const micRecorderRef = useRef<MediaRecorder | null>(null);
  const aiRecorderRef = useRef<MediaRecorder | null>(null);
  const screenChunksRef = useRef<Blob[]>([]);
  const micChunksRef = useRef<Blob[]>([]);
  const aiChunksRef = useRef<Blob[]>([]);

  const start = useCallback(async () => {
    setError(null);
    try {
      // 1. Capture microphone
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // 2. Capture AI audio (from audio element via captureStream)
      const aiAudioElement = getAiAudioElement?.();
      let aiStream: MediaStream | null = null;
      if (aiAudioElement) {
        try {
          const el = aiAudioElement as HTMLMediaElement & { captureStream?: () => MediaStream; mozCaptureStream?: () => MediaStream };
          aiStream = el.captureStream?.() ?? el.mozCaptureStream?.() ?? null;
        } catch {
          // captureStream may not be available in some browsers
        }
      }

      // 3. Capture screen (video + optional mixed audio)
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false, // We record mic and ai separately
      });

      const screenVideoTrack = displayStream.getVideoTracks()[0];

      // Create MediaRecorders
      const screenStream = new MediaStream([screenVideoTrack]);
      screenChunksRef.current = [];
      micChunksRef.current = [];
      aiChunksRef.current = [];

      const screenRecorder = new MediaRecorder(screenStream);
      const micRecorder = new MediaRecorder(micStream);
      let aiRecorder: MediaRecorder | null = null;

      screenRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) screenChunksRef.current.push(e.data);
      };
      micRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) micChunksRef.current.push(e.data);
      };

      if (aiStream && aiStream.getTracks().length > 0) {
        aiRecorder = new MediaRecorder(aiStream);
        aiRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) aiChunksRef.current.push(e.data);
        };
      }

      screenRecorder.start(1000);
      micRecorder.start(1000);
      aiRecorder?.start(1000);

      screenRecorderRef.current = screenRecorder;
      micRecorderRef.current = micRecorder;
      aiRecorderRef.current = aiRecorder;

      setIsRecording(true);
      onStart?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      onStop?.(null);
    }
  }, [getAiAudioElement, onStart, onStop]);

  const stop = useCallback(() => {
    const screenRecorder = screenRecorderRef.current;
    const micRecorder = micRecorderRef.current;
    const aiRecorder = aiRecorderRef.current;

    if (!screenRecorder || !micRecorder) {
      setIsRecording(false);
      onStop?.(null);
      return;
    }

    const resolveBlobs = () => {
      const screenBlob = screenChunksRef.current.length > 0
        ? new Blob(screenChunksRef.current, { type: "video/webm" })
        : new Blob([], { type: "video/webm" });
      const micBlob = micChunksRef.current.length > 0
        ? new Blob(micChunksRef.current, { type: "audio/webm" })
        : new Blob([], { type: "audio/webm" });
      const aiBlob = aiChunksRef.current.length > 0
        ? new Blob(aiChunksRef.current, { type: "audio/webm" })
        : new Blob([], { type: "audio/webm" });

      const blobs: MockInterviewBlobs = { screen: screenBlob, mic: micBlob, ai: aiBlob };
      setIsRecording(false);
      onStop?.(blobs);
    };

    let done = 0;
    const total = aiRecorder ? 3 : 2;

    const checkDone = () => {
      done++;
      if (done >= total) resolveBlobs();
    };

    screenRecorder.onstop = checkDone;
    micRecorder.onstop = checkDone;
    aiRecorder ? (aiRecorder.onstop = checkDone) : checkDone();

    screenRecorder.stop();
    micRecorder.stop();
    aiRecorder?.stop();

    screenRecorderRef.current = null;
    micRecorderRef.current = null;
    aiRecorderRef.current = null;
  }, [onStop]);

  return { isRecording, error, start, stop };
}
