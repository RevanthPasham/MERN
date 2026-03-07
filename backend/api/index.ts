import "dotenv/config";
import serverless from "serverless-http";
import app from "../src/app";
import { initModels } from "../src/db/models";

let initialized = false;
let initError: Error | null = null;

async function init() {
  if (initialized) return;
  if (initError) throw initError;
  try {
    await initModels();
    initialized = true;
  } catch (err) {
    initError = err instanceof Error ? err : new Error(String(err));
    throw initError;
  }
}

const serverlessHandler = serverless(app);

const handler = async (req: any, res: any) => {
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
  return serverlessHandler(req, res);
};

export default handler;