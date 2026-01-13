export type ProductImage = {
  image_url: string;
  is_cover: boolean;
};

export type ProductProfile = {
  name: string;
};

export type ProductCategory = {
  namecategories: string;
};

export type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  type: "venda" | "troca";
  condition: "novo" | "seminovo" | "usado";
  profiles: ProductProfile;
  categories: ProductCategory;
  product_images: ProductImage[];
};
