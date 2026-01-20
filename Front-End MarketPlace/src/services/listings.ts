import api from "./api";
import type { ListingFilters } from "@/types/Filters";

/**
 * Tipagem baseada no retorno real do backend
 */
export type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  condition: "novo" | "seminovo" | "usado";
  type: "venda" | "troca";
  created_at: string;
  profile_id: string;

  profiles: {
    name: string;
    email: string;
    matricula: string;
  };

  categories: {
    namecategories: string;
  };

  product_images: {
    image_url: string;
    is_cover: boolean;
  }[];
};

/**
 * GET /products
 */
export async function fetchListings(filters: ListingFilters = {}): Promise<Product[]> {
  const response = await api.get("/products", { params: filters });
  return response.data;
}

/**
 * POST /products
 */
export type CreateProductDTO = {
  title: string;
  description?: string;
  price: number;
  category_id: string;
  condition: "novo" | "seminovo" | "usado";
  type: "venda" | "troca";
  product_images?: string[];
  lat?: number;
  lng?: number;
  images_to_remove?: string[];
  cover_image_url?: string | null;
};

export type UpdateProductDTO = Partial<CreateProductDTO>;

export async function getListingById(id: string) {
  const response = await api.get(`/products/${id}`);
  return response.data;
}

export async function updateListing(
  id: string,
  data: UpdateProductDTO){
  const response = await api.put(`/products/${id}`, data);
  return response.data;
}

export async function deleteListing(id: string) {
  const response = await api.delete(`/products/${id}`);
  return response.data;
}

export async function createListing(data: CreateProductDTO) {
  const response = await api.post("/products", data);
  return response.data;
}
