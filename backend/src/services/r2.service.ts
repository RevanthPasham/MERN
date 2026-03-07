import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";

let client: S3Client | null = null;

function getClient(): S3Client {
  if (!client) {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.R2_BUCKET_NAME || "recordings";

    if (!accountId || !accessKeyId || !secretAccessKey) {
      throw new Error("R2 credentials not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY.");
    }

    client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId.trim(),
        secretAccessKey: secretAccessKey.trim(),
      },
    });
  }
  return client;
}

export function isR2Configured(): boolean {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY
  );
}

export function getBucketName(): string {
  return process.env.R2_BUCKET_NAME || "recordings";
}

type RecordingSubFolder = "mock" | "tabs";

function buildKey(subFolder: RecordingSubFolder, sessionId: string, filename: string): string {
  const safeSession = sessionId.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `recordings/${subFolder}/${safeSession}/${filename}`;
}

export async function uploadToR2(
  buffer: Buffer,
  subFolder: RecordingSubFolder,
  sessionId: string,
  originalFilename: string,
  contentType = "video/webm"
): Promise<string> {
  const ext = path.extname(originalFilename) || ".webm";
  const key = buildKey(subFolder, sessionId, `${uuidv4()}${ext}`);
  const cmd = new PutObjectCommand({
    Bucket: getBucketName(),
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });
  await getClient().send(cmd);

  // Return public URL - R2 public bucket URL format
  // If using custom domain: https://your-domain.com/key
  const publicUrl = process.env.R2_PUBLIC_URL;
  if (publicUrl) {
    const base = publicUrl.replace(/\/$/, "");
    return `${base}/${key}`;
  }
  // Fallback: R2 default public URL (requires bucket to be public)
  return `https://${getBucketName()}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;
}

export async function getFromR2(key: string): Promise<Buffer> {
  const cmd = new GetObjectCommand({
    Bucket: getBucketName(),
    Key: key,
  });
  const response = await getClient().send(cmd);
  const body = response.Body as Readable;
  const chunks: Buffer[] = [];
  for await (const chunk of body) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}

export async function deleteFromR2(key: string): Promise<void> {
  const cmd = new DeleteObjectCommand({
    Bucket: getBucketName(),
    Key: key,
  });
  await getClient().send(cmd);
}
