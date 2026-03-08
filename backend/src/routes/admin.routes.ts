import { Router } from "express";
import { requireAdmin } from "../middleware/auth";
import * as adminAuthController from "../controllers/adminAuth.controller";
import * as adminOrdersController from "../controllers/adminOrders.controller";
import * as adminProductsController from "../controllers/adminProducts.controller";
import * as adminCollectionsController from "../controllers/adminCollections.controller";
import * as adminBannersController from "../controllers/adminBanners.controller";
import * as adminCartsController from "../controllers/adminCarts.controller";
import * as adminAnalyticsController from "../controllers/adminAnalytics.controller";
import * as adminUploadController from "../controllers/adminUpload.controller";
import * as adminInviteController from "../controllers/adminInvite.controller";
import * as adminSettingsController from "../controllers/adminSettings.controller";
import * as setPasswordController from "../controllers/setPassword.controller";

const router = Router();

// Auth (no admin middleware)
router.post("/auth/login", adminAuthController.login);

// Set password from invitation (public - no admin auth)
router.post("/set-password", setPasswordController.setPassword);

// All below require admin
router.use(requireAdmin);

// Orders
router.get("/orders", adminOrdersController.list);
router.get("/orders/:id", adminOrdersController.getById);
router.patch("/orders/:id/status", adminOrdersController.updateStatus);

// Products – any admin can add/edit
router.get("/products", adminProductsController.list);
router.get("/products/:id", adminProductsController.getById);
router.post("/products", adminProductsController.create);
router.patch("/products/:id", adminProductsController.update);

// Collections – any admin can add/edit
router.get("/collections", adminCollectionsController.list);
router.get("/collections/:id", adminCollectionsController.getById);
router.post("/collections", adminCollectionsController.create);
router.patch("/collections/:id", adminCollectionsController.update);
router.get("/collections/:id/products", adminCollectionsController.getProducts);
router.patch("/collections/:id/products", adminCollectionsController.setProducts);

// Banners – any admin can add/edit
router.get("/banners", adminBannersController.list);
router.get("/banners/:id", adminBannersController.getById);
router.post("/banners", adminBannersController.create);
router.patch("/banners/:id", adminBannersController.update);

// Carts (users with cart items)
router.get("/carts", adminCartsController.list);

// Analytics & export
router.get("/analytics", adminAnalyticsController.get);
router.get("/analytics/export", adminAnalyticsController.exportExcel);

// Upload image (Cloudinary)
router.post("/upload", adminUploadController.upload);
router.post("/upload/delete", adminUploadController.deleteUpload);

export default router;
