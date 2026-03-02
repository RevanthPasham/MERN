import "dotenv/config";
import app from "../src/app";
import { initModels } from "../src/db/models";

let isInitialized = false;

export default async function handler(req: any, res: any) {
  if (!isInitialized) {
    await initModels();
    isInitialized = true;
  }

  return app(req, res);
}