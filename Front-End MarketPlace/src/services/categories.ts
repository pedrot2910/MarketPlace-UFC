import api from "./api";

export interface Category {
  id: string;
  namecategories: string;
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get("/categories");
  return data;
}
