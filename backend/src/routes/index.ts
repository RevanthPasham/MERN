import { Router } from "express";
import categoryRoutes from "./category.routes";
import collectionRoutes from "./collection.routes";
import productRoutes from "./product.routes";

const router = Router();

router.use("/categories", categoryRoutes);
router.use("/collections", collectionRoutes);
router.use("/products", productRoutes);

export default router;
