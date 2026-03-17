import { reviewService } from "../services/review.service.js";

const reviewController = {
  createReview: async (req, res, next) => {
    try {
      const newReview = await reviewService.createReview(req.body, req.user.id);
      res.status(201).json(newReview);
    } catch (error) {
      next(error);
    }
  },

  getSellerReviews: async (req, res, next) => {
    try {
      const reviews = await reviewService.getSellerReviews(req.params.id);
      res.status(200).json(reviews);
    } catch (error) {
      next(error);
    }
  },
};

export { reviewController };
