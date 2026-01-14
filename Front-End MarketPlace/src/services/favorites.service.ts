import api from "./api";

export interface FavoriteProduct {
  id: string;
  created_at: string;
  products: {
    id: string;
    title: string;
    price: number;
    condition: string;
    product_images: { image_url: string }[];
  };
}

export async function toggleFavorite(userId: string, productId: string) {
  const response = await api.post("/favorites/toggle", {
    user_id: userId,
    product_id: productId,
  });
  return response.data;
}

export async function getFavoritesByUser(userId: string): Promise<FavoriteProduct[]> {
  const response = await api.get(`/favorites/user/${userId}`);
  return response.data;
}

export async function checkIsFavorite(userId: string, productId: string): Promise<boolean> {
  try {
    const favorites = await getFavoritesByUser(userId);
    return favorites.some((fav) => fav.products.id === productId);
  } catch (err) {
    return false;
  }
}
