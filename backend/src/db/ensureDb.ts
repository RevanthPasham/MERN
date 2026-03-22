import { initModels } from "./models";

/** Single-flight: one authenticate per serverless instance / Node process */
let initPromise: Promise<void> | null = null;

/**
 * Ensures Sequelize is ready (associations + authenticate). Safe to call from every request;
 * resolves immediately after the first successful init. No sync/migrations here.
 */
export function ensureDbReady(): Promise<void> {
  if (!initPromise) {
    initPromise = initModels();
  }
  return initPromise;
}
