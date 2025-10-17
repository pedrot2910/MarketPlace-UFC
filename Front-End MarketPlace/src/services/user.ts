import { api } from "./api";
import type { User } from "../types/user";

// Buscar usuário por ID
export async function fetchUser(id: string): Promise<User> {
  const res = await api.get<User>(`/user/${id}`);
  return res.data;
}
