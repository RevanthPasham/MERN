import OpenAI from "openai";
import * as fs from "fs";

let openai: OpenAI | null = null;

function getClient(): OpenAI {
  if (!openai) {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error("OPENAI_API_KEY is not set");
    openai = new OpenAI({ apiKey: key });
  }
  return openai;
}

export async function transcribeWav(wavPath: string): Promise<string> {
  if (!fs.existsSync(wavPath)) {
    throw new Error(`File not found: ${wavPath}`);
  }

  const file = fs.createReadStream(wavPath);
  const client = getClient();
  const response = await client.audio.transcriptions.create({
    file: file,
    model: "whisper-1",
    response_format: "verbose_json",
    timestamp_granularities: ["segment"],
  });

  // Response may have segments or text
  const r = response as unknown as {
    text?: string;
    segments?: Array<{ start: number; end: number; text: string }>;
  };

  if (r.segments && Array.isArray(r.segments) && r.segments.length > 0) {
    return r.segments.map((s) => s.text).join(" ").trim() || r.text || "";
  }

  return r.text || "";
}

export async function transcribeWavWithSegments(
  wavPath: string
): Promise<Array<{ start: number; end: number; text: string }>> {
  if (!fs.existsSync(wavPath)) {
    throw new Error(`File not found: ${wavPath}`);
  }

  const file = fs.createReadStream(wavPath);
  const client = getClient();
  const response = await client.audio.transcriptions.create({
    file: file,
    model: "whisper-1",
    response_format: "verbose_json",
    timestamp_granularities: ["segment"],
  });

  const r = response as unknown as {
    segments?: Array<{ start: number; end: number; text: string }>;
  };

  return r.segments || [];
}
