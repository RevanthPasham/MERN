import serverless from "serverless-http";
import app from "../app";
import { sequelize } from "../config/db";

let isConnected = false;

async function connectDB() {
  if (!isConnected) {
    await sequelize.authenticate();
    isConnected = true;
  }
}

export default async function handler(req: any, res: any) {
  await connectDB();
  return serverless(app)(req, res);
}