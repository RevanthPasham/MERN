import "dotenv/config";
import serverless from "serverless-http";
import app from "../src/app";

const lambda = serverless(app);

type NodeResponse = {
  statusCode?: number;
  headersSent?: boolean;
  writableEnded?: boolean;
  setHeader: (k: string, v: string) => void;
  end: (chunk?: string) => void;
  once: (ev: string, fn: () => void) => void;
};

export default async function handler(req: unknown, res: unknown): Promise<void> {
  const r = req as { method?: string };
  const response = res as NodeResponse;

  try {
    if (r.method === "OPTIONS") {
      response.statusCode = 204;
      response.setHeader("Access-Control-Allow-Origin", "*");
      response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
      response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
      response.end();
      return;
    }

    await new Promise<void>((resolve, reject) => {
      let settled = false;
      const done = () => {
        if (!settled) {
          settled = true;
          resolve();
        }
      };
      response.once("finish", done);
      response.once("close", done);
      if (response.writableEnded) {
        queueMicrotask(done);
      }
      Promise.resolve(lambda(req as object, res as object)).catch((err: unknown) => {
        if (!settled) {
          settled = true;
          reject(err);
        }
      });
    });
  } catch {
    if (!response.headersSent && !response.writableEnded) {
      response.statusCode = 500;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ success: false, error: "Internal server error" }));
    }
  }
}
