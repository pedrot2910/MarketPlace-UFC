import { useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../../types/user";
import { authService } from "../../services/auth.service";
import { AuthContext } from "./AuthContext";
import { chatService } from "../../services/chatservice";

interface ProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }: ProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedGuest = localStorage.getItem("isGuest");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    } else if (storedGuest === "true") {
      setIsGuest(true);
    }
  }, []);

  async function login(email: string, password: string) {
    try {
      const { token, user } = await authService.signIn(email, password);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.removeItem("isGuest");
      setIsGuest(false);

      setToken(token);
      setUser(user);

      navigate("/marketplace");
    } catch {
      alert("Erro ao fazer login");
    }
  }

  function loginAsGuest() {
    setIsGuest(true);
    localStorage.setItem("isGuest", "true");

    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/marketplace");
  }

  function logout() {
    setUser(null);
    setToken(null);
    setIsGuest(false);
    localStorage.clear();
    chatService.disconnect(); // Desconecta o socket ao fazer logout
    navigate("/login");
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isGuest, login, loginAsGuest, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
