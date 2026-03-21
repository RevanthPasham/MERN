import "dotenv/config";
import serverless from "serverless-http";
import app from "../src/app";
import { initModels } from "../src/db/models";

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
      await withTimeout(initModels(), 15000);
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

const handler = async (req: any, res: any) => {
  // Handle CORS preflight quickly to avoid timeouts from browser OPTIONS requests.
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.end();
    return;
  }

  try {
    await init();
  } catch (err) {
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
    await Promise.resolve(serverlessHandler(req, res));
  } catch (err) {
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