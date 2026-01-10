import api from "./api";

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
export async function fetchListings(): Promise<Product[]> {
  const response = await api.get("/products");
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
};

export async function getListingById(id: string) {
  const response = await api.get(`/products/${id}`);
  return response.data;
}

export async function createListing(data: CreateProductDTO) {
  const response = await api.post("/products", data);
  return response.data;
}
