import { useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../../types/user";
import { authService } from "../../services/auth.service";
import { AuthContext } from "./AuthContext";

interface ProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }: ProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  async function login(email: string, password: string) {
    try {
      const { token, user } = await authService.signIn(email, password);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(token);
      setUser(user);

      navigate("/marketplace");
    } catch {
      alert("Erro ao fazer login");
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.clear();
    navigate("/login");
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
