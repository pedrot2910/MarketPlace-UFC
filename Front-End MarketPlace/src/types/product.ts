export type ProductImage = {
  image_url: string;
  is_cover: boolean;
};

export type ProductProfile = {
  name: string;
};

export type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  type: "venda" | "troca";
  profiles: ProductProfile;
  product_images: ProductImage[];
};
