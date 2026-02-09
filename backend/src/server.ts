import 'dotenv/config';
import app from "./app";
import { initModels } from "./db/models";

async function start() {
  await initModels();

  app.listen(4000, () => {
    console.log("server running on 4000");
  });
}

start();
