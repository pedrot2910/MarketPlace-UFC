import supabase from "../supabase.js";
import { appError } from "../utils/appError.utils.js";
import { notificationsService } from "./notifications.service.js";

const reviewService = {

  // newReview: async (body, reviewerId) => {

  //   if (body.seller_id === reviewerId) {
  //     throw appError(400, "Você não pode avaliar a si mesmo");
  //   }
  
  createReview: async (body, reviewerId) => {

    if (body.seller_id === reviewerId) {
      throw appError(400, "Você não pode avaliar a si mesmo");
    }
    const payload = {
      ...body,
      reviewer_id: reviewerId,
    }

    console.log(payload);

    // Verificar se o usuário já avaliou este produto
    const { data: existingReview } = await supabase
      .from("reviews")
      .select("id")
      .eq("reviewer_id", reviewerId)
      .eq("product_id", body.product_id)
      .maybeSingle();

    if (existingReview) {
      throw new appError("Você já avaliou este produto", 400);
    }

    const { data: review, error } = await supabase
      .from("reviews")
      .insert([payload])
      .select(`*, profiles!reviewer_id (name)`)
      .single();

    if (error) {
      if (error.code === "23505")
        throw new appError("Você já avaliou este vendedor neste produto", 400);
      if (error.code === "23503")
        throw new appError("Vendedor ou produto não encontrado", 400);
      throw new appError("Erro ao fazer review: " + error.message);
    }

    const notificationBody = {
      userId: body.seller_id,
      type: "review",
      title: "Nova avaliação recebida",
      content: `${review.profiles.name} te deu uma avaliação de ${body.rating} estrelas!`,
      link: `/product/${body.product_id}`,
    }

    try {
      await notificationsService.createNotification(notificationBody);
    } catch (notifError) {
      console.error("Erro ao criar notificação de review (não bloqueante):", notifError.message);
    }

    return review;
  },

  getSellerReviews: async (sellerId) => {

    const { data, error } = await supabase
      .from("reviews")
      .select(
        `*, 
        reviewer:profiles!reviewer_id (id, name, profile_image:profile_images(image_url)), 
        product:products(title)`,
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

  getUserReview: async (body, userId) => {

    const { data, error } = await supabase
      .from("reviews")
      .select(`*`)
      .eq("reviewer_id", userId)
      .eq("seller_id", body.seller_id)
      .single();

    if (error) throw appError(error.message, 500);

    return data;
  },

  updateReview: async (body, userId) => {


    const { data, error } = await supabase
      .from("reviews")
      .update(body)
      .eq("reviewer_id", userId)
      .eq("seller_id", body.seller_id)
      .select(`*`)
      .single();

    if (error) throw appError(error.message, 500);

    return data;
  },

};

export { reviewService };
