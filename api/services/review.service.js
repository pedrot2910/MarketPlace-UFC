import { parse } from "dotenv";
import supabase from "../supabase.js";
import { appError } from "../utils/appError.utils.js";

const reviewService = {
  createReview: async (body, reviewerId) => {
    if (body.seller_id === reviewerId) {
      throw appError(400, "Você não pode avaliar a si mesmo");
    }

    const { data: review, error } = await supabase
      .from("reviews")
      .insert([
        {
          ...body,
          reviewer_id: reviewerId,
        },
      ])
      .select(`*, profiles!reviewer_id (name)`)
      .single();

    if (error) {
      if (error.code === "23503")
        throw new appError("Você já avaliou este produto", 400);
      throw new appError(error.message, 500);
    }

    await supabase.from("notifications").insert([
      {
        user_id: body.seller_id,
        title: "Nova avaliação recebida",
        message: `${review.profiles.name} te deu uma avaliação de ${body.rating} estrelas!`,
        type: "review",
        read: false,
      },
    ]);

    return review;
  },

  getSellerReviews: async (sellerId) => {
    const { data, error } = await supabase
      .from("reviews")
      .select(
        `*, reviewer:profiles!reviewer_id (id, name, profile_image:profile_images(image_url)), product:products(title)`,
      )
      .eq("seller_id", sellerId)
      .order("created_at", { ascending: false });

    if (error) throw appError(error.message, 500);

    const totalReviews = data.length;
    const averageRating =
      totalReviews > 0
        ? data.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews
        : 0;

    return {
      reviews: data,
      stats: {
        average: parseFloat(averageRating.toFixed(1)),
        total: totalReviews,
      },
    };
  },
};

export { reviewService };
