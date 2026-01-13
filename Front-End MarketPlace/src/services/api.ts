import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// INTERCEPTOR DE REQUEST
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response para tratar sessão expirada
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Token inválido ou expirado");
      
      // Limpa o localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Mostra alerta
      alert("Sua sessão expirou. Por favor, faça login novamente.");
      
      // Redireciona para login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
