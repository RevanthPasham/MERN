import "dotenv/config";
import app from "./app";
import { initModels } from "./db/models";

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await initModels();
    const { Banner, Product } = await import("./db/models");
    const { populateInitialData, ensureCollectionLinksAndPrices } = await import("./db/seed");
    const bannerCount = await Banner.count();
    const productCount = await Product.count();
    if (bannerCount === 0 || productCount === 0) {
      await populateInitialData();
    }
    await ensureCollectionLinksAndPrices();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
