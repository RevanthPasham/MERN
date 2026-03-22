/**
 * Structured logs for Vercel / local. Lines are JSON so you can filter in the Vercel dashboard.
 * Never log secrets (passwords, full DATABASE_URL).
 */

export function runtimeLog(
  event: string,
  data?: Record<string, string | number | boolean | null | undefined>
): void {
  console.log(
    JSON.stringify({
      source: "houseof-backend",
      event,
      ts: new Date().toISOString(),
      vercel: Boolean(process.env.VERCEL),
      node: process.version,
      ...data,
    })
  );
}

/** Hostname only — safe to log for "which DB am I hitting?" */
export function safeDatabaseHost(): string | null {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) return null;
  try {
    return new URL(raw).hostname;
  } catch {
    return "unparseable-DATABASE_URL";
  }
}

export function formatError(err: unknown): { name: string; message: string; code?: string } {
  if (err instanceof Error) {
    const code = "code" in err && typeof (err as NodeJS.ErrnoException).code === "string"
      ? (err as NodeJS.ErrnoException).code
      : undefined;
    return { name: err.name, message: err.message.slice(0, 500), code };
  }
  return { name: "non-Error", message: String(err).slice(0, 500) };
}
