import { motion } from "framer-motion";
import { useState } from "react";
import { Lock, Mail, User } from "lucide-react"; // Adicionei o User para o ícone
import { useAuth } from "../hooks/auth/useAuth"; // Ajuste o caminho se necessário
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Pegamos a função loginAsGuest do contexto
  const { login, loginAsGuest } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  const handleGuestLogin = () => {
    loginAsGuest();
  };

  return (
    <BackgroundGradientAnimation>
      <div className="absolute z-50 inset-0 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/20 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/20"
        >
          {/* LOGO */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <img
              src="/logoruim3.png"
              alt="Logo ReUse"
              className="mx-auto w-24 h-24 object-contain"
            />
            <h1 className="text-3xl font-bold text-[var(--color-text-invert)] drop-shadow-[0_0_10px_rgba(124,58,237,0.7)]">
              Bem-vindo ao ReUse
            </h1>
            <p className="text-[var(--color-text-invert)]/80 mt-2">
              Entre para continuar
            </p>
          </motion.div>

          {/* FORMULÁRIO */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <Mail
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-invert)]/70"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-[var(--color-text-invert)] placeholder-[var(--color-text-invert)]/60 border border-white/20 focus:border-[var(--color-secondary-light)] focus:ring-2 focus:ring-[var(--color-secondary)] outline-none transition"
                required
              />
            </div>

            <div className="relative">
              <Lock
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-invert)]/70"
              />
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-[var(--color-text-invert)] placeholder-[var(--color-text-invert)]/60 border border-white/20 focus:border-[var(--color-secondary-light)] focus:ring-2 focus:ring-[var(--color-secondary)] outline-none transition"
                required
              />
            </div>

            <div className="flex flex-col gap-3 pt-2">
              {/* Botão de Login Principal */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
                type="submit"
                className="w-full py-3 bg-[var(--color-secondary-dark)] hover:bg-[var(--color-secondary)] text-[var(--color-text-invert)] font-semibold rounded-xl shadow-lg transition-all duration-200"
              >
                Entrar
              </motion.button>

              {/* Botão de Convidado */}
              <motion.button
                type="button" // Importante: type="button" para não submeter o form
                onClick={handleGuestLogin}
                whileHover={{
                  scale: 1.02,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-full py-3 bg-transparent border border-white/30 text-[var(--color-text-invert)] font-medium rounded-xl hover:border-white/50 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <User size={18} />
                Entrar como Visitante
              </motion.button>
            </div>
          </form>

          {/* LINKS */}
          <div className="text-center mt-6 text-[var(--color-text-invert)]/80 text-sm">
            <p>
              Não tem uma conta?{" "}
              <a
                href="/register"
                className="text-[var(--color-text-invert)] font-semibold hover:underline"
              >
                Cadastre-se
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </BackgroundGradientAnimation>
  );
}
