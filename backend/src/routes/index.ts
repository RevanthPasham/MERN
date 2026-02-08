import { Router } from "express";
import productRoutes from "./product.routes";
import collectionRoutes from "./collection.routes";

const router = Router();

router.use("/products", productRoutes);
router.use("/collections", collectionRoutes);

export default router;
