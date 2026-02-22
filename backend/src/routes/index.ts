import { Router } from "express";
import categoryRoutes from "./category.routes";
import collectionRoutes from "./collection.routes";
import productRoutes from "./product.routes";
import authRoutes from "./auth.routes";
import bannerRoutes from "./banner.routes";
import orderRoutes from "./order.routes";
import cartRoutes from "./cart.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/banners", bannerRoutes);
router.use("/orders", orderRoutes);
router.use("/cart", cartRoutes);
router.use("/categories", categoryRoutes);
router.use("/collections", collectionRoutes);
router.use("/products", productRoutes);

export default router;
