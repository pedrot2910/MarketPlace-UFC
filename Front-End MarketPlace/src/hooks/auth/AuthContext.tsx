import { createContext, useState, useEffect, type ReactNode } from "react";
import { mockUsers } from "../../services/api";
import { useNavigate } from "react-router-dom";
import type { User } from "../../types/user";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
}

// Criar o contexto tipado
export const AuthContext = createContext<AuthContextType | null>(null);

interface ProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }: ProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  function login(email: string, password: string) {
    const foundUser = mockUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (!foundUser) {
      alert("Usuário ou senha incorretos");
      return;
    }

    localStorage.setItem("user", JSON.stringify(foundUser));
    setUser(foundUser);
    navigate("/home");
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
