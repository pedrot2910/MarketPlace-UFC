
import api from "./api";
import type { User } from "../types/user";



export interface SignInResponse {
  token: string;
  user: User;
  profile: {
    id: string;
    name: string;
    email: string;
    matricula: string;
    role: string;
  };
}


export interface SignUpPayload {
  email: string;
  password: string;
  name: string;
  role: string;
}

export const authService = {
  signIn: async (email: string, password: string): Promise<SignInResponse> => {
    const response = await api.post(`/auth/signin`, {
      email,
      password,
    });
    return response.data;
  },

  signUp: async (payload: SignUpPayload) => {
    const response = await api.post(`/auth/signup`, payload);
    return response.data;
  },
};
