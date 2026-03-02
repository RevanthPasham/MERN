import app from "../src/app";
import { sequelize } from "../src/config/db";
import serverless from "serverless-http";

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await sequelize.authenticate();
  console.log("Database connected");
  isConnected = true;
}

export default async function handler(req: any, res: any) {
  await connectDB();
  return serverless(app)(req, res);
}