import { Router } from "express";
import { reviewController } from "../controllers/review.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validation.middleware.js";
import { reviewSchema } from "../schemas/review.schema.js";

const reviewRoutes = Router();

reviewRoutes.post(
  "/",
  authMiddleware,
  validateSchema(reviewSchema.create),
  reviewController.createReview,
);

reviewRoutes.get(
  "/seller/:sellerId",
  validateSchema(reviewSchema.getBySellerId),
  reviewController.getSellerReviews,
);

export { reviewRoutes };
