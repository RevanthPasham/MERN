import { useState, useCallback, useRef } from "react";

export interface UseTabRecorderOptions {
  onStart?: () => void;
  onStop?: (blob: Blob | null) => void;
}

export function useTabRecorder({ onStart, onStop }: UseTabRecorderOptions = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const start = useCallback(async () => {
    setError(null);
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      chunksRef.current = [];
      const recorder = new MediaRecorder(displayStream);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start(1000);
      recorderRef.current = recorder;
      setIsRecording(true);
      onStart?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      onStop?.(null);
    }
  }, [onStart, onStop]);

  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    if (!recorder) {
      setIsRecording(false);
      onStop?.(null);
      return;
    }

    recorder.onstop = () => {
      const blob =
        chunksRef.current.length > 0
          ? new Blob(chunksRef.current, { type: "video/webm" })
          : new Blob([], { type: "video/webm" });
      setIsRecording(false);
      onStop?.(blob);
    };

    recorder.stop();
    recorderRef.current = null;
  }, [onStop]);

  return { isRecording, error, start, stop };
}
