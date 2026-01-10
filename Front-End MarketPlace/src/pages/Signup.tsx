import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import { authService } from "../services/auth.service";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await authService.signUp({
        name,
        email,
        password,
        matricula: "000000",
        role: "student",
      });

      navigate("/login");
    } catch (error: any) {
      alert(error.response?.data?.error || "Erro ao cadastrar");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#9787F3] via-[#7b6ccb] to-[#2D274B] p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/20"
      >
        {/* LOGO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <img
            src="/LogoReUse.png"
            alt="Logo ReUse"
            className="mx-auto w-24 h-24 object-contain"
          />
          <h1 className="text-3xl font-bold text-[#EAEFFE] drop-shadow-[0_0_10px_rgba(151,135,243,0.7)]">
            Crie sua conta
          </h1>
          <p className="text-[#EAEFFE]/80 mt-2">Comece a usar o ReUse</p>
        </motion.div>

        {/* FORM */}
        <form onSubmit={handleSignup} className="space-y-6">
          {/* Nome */}
          <div className="relative">
            <User
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#EAEFFE]/70"
            />
            <input
              type="text"
              placeholder="Nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-[#EAEFFE] placeholder-[#EAEFFE]/60 border border-white/20 focus:border-[#EAEFFE] focus:ring-2 focus:ring-[#9787F3] outline-none transition"
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#EAEFFE]/70"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-[#EAEFFE] placeholder-[#EAEFFE]/60 border border-white/20 focus:border-[#EAEFFE] focus:ring-2 focus:ring-[#9787F3] outline-none transition"
              required
            />
          </div>

          {/* Senha */}
          <div className="relative">
            <Lock
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#EAEFFE]/70"
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-[#EAEFFE] placeholder-[#EAEFFE]/60 border border-white/20 focus:border-[#EAEFFE] focus:ring-2 focus:ring-[#9787F3] outline-none transition"
              required
            />
          </div>

          {/* Botão */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300 }}
            type="submit"
            className="w-full py-3 bg-[#9878f3] hover:bg-[#7b6ccb] text-[#EAEFFE] font-semibold rounded-xl shadow-lg transition"
          >
            Criar conta
          </motion.button>
        </form>

        {/* LINKS */}
        <div className="text-center mt-6 text-[#EAEFFE]/80 text-sm">
          <p>
            Já tem uma conta?{" "}
            <a
              href="/login"
              className="text-[#EAEFFE] font-semibold hover:underline"
            >
              Entrar
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
