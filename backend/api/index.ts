import serverless from "serverless-http";
import app from "../src/app";
import { initModels } from "../src/db/models";

let initialized = false;

async function init() {
  if (!initialized) {
    await initModels();
    initialized = true;
  }
}

const handler = async (req: any, res: any) => {
  await init();
  return serverless(app)(req, res);
};

export default handler;