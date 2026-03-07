import { Router } from "express";
import { requireAdmin, requireRole } from "../middleware/auth";
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

// Products (admin role cannot add/edit - only view)
router.get("/products", adminProductsController.list);
router.get("/products/:id", adminProductsController.getById);
router.post("/products", requireRole(["super_admin", "sub_admin"]), adminProductsController.create);
router.patch("/products/:id", requireRole(["super_admin", "sub_admin"]), adminProductsController.update);

// Collections (admin role cannot add/edit - only view)
router.get("/collections", adminCollectionsController.list);
router.get("/collections/:id", adminCollectionsController.getById);
router.post("/collections", requireRole(["super_admin", "sub_admin"]), adminCollectionsController.create);
router.patch("/collections/:id", requireRole(["super_admin", "sub_admin"]), adminCollectionsController.update);
router.get("/collections/:id/products", adminCollectionsController.getProducts);
router.patch("/collections/:id/products", adminCollectionsController.setProducts);

// Banners (admin role cannot add/edit - only view)
router.get("/banners", adminBannersController.list);
router.get("/banners/:id", adminBannersController.getById);
router.post("/banners", requireRole(["super_admin", "sub_admin"]), adminBannersController.create);
router.patch("/banners/:id", requireRole(["super_admin", "sub_admin"]), adminBannersController.update);

// Carts (users with cart items)
router.get("/carts", adminCartsController.list);

// Analytics & export
router.get("/analytics", adminAnalyticsController.get);
router.get("/analytics/export", adminAnalyticsController.exportExcel);

// Upload image (Cloudinary)
router.post("/upload", adminUploadController.upload);
router.post("/upload/delete", adminUploadController.deleteUpload);

export default router;
