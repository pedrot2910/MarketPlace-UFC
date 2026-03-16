import { Router } from "express";
import { productController } from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validation.middleware.js";
import { productSchema } from "../schemas/product.schema.js";

const productRoutes = Router();

productRoutes.post(
  "/",
  authMiddleware,
  validateSchema(productSchema.create),
  productController.createProduct,
);
productRoutes.get("/", productController.getAllProducts);
productRoutes.get(
  "/profile/:profileId",
  productController.getProductsByProfileId,
);
productRoutes.get(
  "/:id",
  validateSchema(productSchema.getProductById),
  productController.getProductById,
);
productRoutes.delete(
  "/:id",
  authMiddleware,
  validateSchema(productSchema.delete),
  productController.deleteProductById,
);
productRoutes.put(
  "/:id",
  authMiddleware,
  validateSchema(productSchema.update),
  productController.updateProductById,
);

productRoutes.patch(
  "/:id/sold",
  authMiddleware,
  validateSchema(productSchema.markAsSold),
  productController.markAsSold,
);

export { productRoutes };
