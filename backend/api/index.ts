import "dotenv/config";
import serverless from "serverless-http";
import app from "../src/app";
import { initModels } from "../src/db/models";
import { formatError, runtimeLog, safeDatabaseHost } from "../src/utils/runtimeLog";

let initialized = false;
let initError: Error | null = null;
let initPromise: Promise<void> | null = null;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Initialization timed out after ${ms}ms`));
    }, ms);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

async function init() {
  if (initialized) return;
  if (initError) throw initError;
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      // Fail fast in serverless instead of hanging until platform timeout.
      await withTimeout(initModels(), 25000);
      initialized = true;
    } catch (err) {
      initError = err instanceof Error ? err : new Error(String(err));
      throw initError;
    } finally {
      initPromise = null;
    }
  })();
  return initPromise;
}

const serverlessHandler = serverless(app);

function normalizePath(url: unknown): string {
  if (typeof url !== "string") return "/";
  const p = url.split("?")[0] || "/";
  return p.startsWith("/") ? p : `/${p}`;
}

const handler = async (req: any, res: any) => {
  const path = normalizePath(req.url);
  const method = req.method || "GET";

  // Handle CORS preflight quickly to avoid timeouts from browser OPTIONS requests.
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.end();
    return;
  }

  // Liveness only: must NOT await init() — that runs DB authenticate() and can hang on Neon/serverless.
  if (method === "GET" && (path === "/api/health" || path.endsWith("/api/health"))) {
    runtimeLog("request_liveness_ok", { path, note: "skipped_db_init" });
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end(
      JSON.stringify({
        success: true,
        message: "Serverless function is running (database not checked on this route)",
        hint: "If /api/banners still times out, the problem is DB connection or queries after init.",
        time: new Date().toISOString(),
      })
    );
    return;
  }

  const reqStarted = Date.now();
  runtimeLog("request_in", { method, path, dbHost: safeDatabaseHost() });

  try {
    const initStarted = Date.now();
    await init();
    runtimeLog("request_init_ok", { method, path, initMs: Date.now() - initStarted });
  } catch (err) {
    const fe = formatError(err);
    runtimeLog("request_init_failed", {
      method,
      path,
      errName: fe.name,
      errMessage: fe.message,
      errCode: fe.code ?? null,
    });
    const message = err instanceof Error ? err.message : String(err);
    const isDbMissing = !process.env.DATABASE_URL || message.includes("DATABASE_URL") || message.includes("connect");
    res.statusCode = 503;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        success: false,
        error: isDbMissing
          ? "Database not configured. Set DATABASE_URL in Vercel Environment Variables."
          : `Server init failed: ${message}`,
      })
    );
    return;
  }

  const requestTimeout = setTimeout(() => {
    if (!res.writableEnded) {
      runtimeLog("request_aborted_slow", {
        method,
        path,
        msSinceStart: Date.now() - reqStarted,
        note: "no response within 25s (DB query or handler stuck)",
      });
      res.statusCode = 504;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          success: false,
          error: "Request timed out after 25s",
        })
      );
    }
  }, 25000);

  try {
    // serverless-http's promise can lag; also resolve when the response is fully sent.
    const handlerPromise = Promise.resolve(serverlessHandler(req, res));
    const responseEnded = new Promise<void>((resolve) => {
      if (res.writableEnded) {
        resolve();
        return;
      }
      res.once("finish", () => resolve());
      res.once("close", () => resolve());
    });
    await Promise.race([handlerPromise, responseEnded]);
    runtimeLog("request_out", {
      method,
      path,
      totalMs: Date.now() - reqStarted,
      statusCode: typeof res.statusCode === "number" ? res.statusCode : undefined,
    });
  } catch (err) {
    const fe = formatError(err);
    runtimeLog("request_handler_error", {
      method,
      path,
      errName: fe.name,
      errMessage: fe.message,
    });
    const message = err instanceof Error ? err.message : String(err);
    if (!res.headersSent && !res.writableEnded) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          success: false,
          error: `Serverless handler error: ${message}`,
        })
      );
    }
  } finally {
    clearTimeout(requestTimeout);
  }
};

export default handler;