import * as ffmpeg from "fluent-ffmpeg";
import * as path from "path";
import * as fs from "fs";

/**
 * Convert webm audio to wav (16kHz mono) for Whisper.
 */
export function webmToWav(inputPath: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(inputPath)) {
      reject(new Error(`Input file not found: ${inputPath}`));
      return;
    }

    ffmpeg(inputPath)
      .audioChannels(1)
      .audioFrequency(16000)
      .toFormat("wav")
      .output(outputPath)
      .on("end", () => resolve())
      .on("error", (err: Error) => reject(err))
      .run();
  });
}

/**
 * Get duration in seconds of an audio/video file.
 */
export function getDurationSeconds(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) reject(err);
      else resolve(metadata.format.duration ?? 0);
    });
  });
}
