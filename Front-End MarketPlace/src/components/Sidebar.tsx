import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Botão do menu */}
      <button
        onClick={toggleSidebar}
        className="top-4 left-4 z-50 p-2 text-[#eaeffe] rounded-lg hover:bg-[#7b6ccb] hover:text-[#EAEFFE] transition"
      >
        {isOpen ? (
          <X size={24} className="text-[#EAEFFE]" />
        ) : (
          <Menu size={24} />
        )}
      </button>

      {/* Animação com Framer Motion */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Sidebar com transição */}
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
              className="fixed top-0 left-0 h-full w-72 bg-[#9878f3] text-white shadow-2xl z-40 flex flex-col"
            >
              {/* Cabeçalho com logo e nome */}
              <div className="flex items-center gap-3 mb-10 mt-12 px-8 py-3 bg-gradient-to-r from-[#7b6ccb] to-[#9878f3] rounded-r-3xl shadow-inner">
                <motion.img
                  src="/LogoReUse.png"
                  alt="Logo ReUse"
                  className="w-12 h-12 object-contain drop-shadow-lg"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                />
                <motion.h2
                  className="text-3xl font-bold text-[#EAEFFE] drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]"
                  style={{
                    WebkitTextStroke: "1px rgba(124,108,203,0.9)",
                    textShadow: "0 0 8px rgba(124,108,203,0.9)",
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  ReUse
                </motion.h2>
              </div>

              {/* Navegação */}
              <nav className="flex flex-col space-y-3 px-8">
                <Link
                  to="/"
                  className="hover:text-[#EAEFFE] hover:bg-[#7b6ccb] p-2 pl-4 rounded-lg transition text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Início
                </Link>
                <Link
                  to="/create-listing"
                  className="hover:text-[#EAEFFE] hover:bg-[#7b6ccb] p-2 pl-4 rounded-lg transition text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Criar Anúncio
                </Link>
                <Link
                  to="/profile"
                  className="hover:text-[#EAEFFE] hover:bg-[#7b6ccb] p-2 pl-4 rounded-lg transition text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Perfil
                </Link>

                <button
                  onClick={() => (window.location.href = "/login")}
                  className="mt-auto text-left text-[#d1cbe6] hover:bg-[#7b6ccb] p-2 pl-4 rounded-lg hover:text-[#EAEFFE] transition"
                >
                  Sair
                </button>
              </nav>
            </motion.div>

            {/* Fundo com blur */}
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
              onClick={toggleSidebar}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
