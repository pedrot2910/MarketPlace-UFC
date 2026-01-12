import api from "./api";
import type { Listing } from "../types/listing";

export const productsService = {
  getByProfile: async (profileId: string): Promise<Listing[]> => {
    const response = await api.get(
      `/products/profile/${profileId}`
    );
    return response.data;
  },
};
