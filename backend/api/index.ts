import "dotenv/config";
import app from "../src/app";

/**
 * Vercel invokes this with Node’s req/res. Export the Express app directly — do NOT wrap with
 * serverless-http (that adapter expects AWS Lambda event shapes and can hang or 504 on Vercel).
 * Do not call app.listen here; local dev uses src/server.ts only.
 */
export default app;
