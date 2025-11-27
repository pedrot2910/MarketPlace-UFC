import { MessageSquareMore, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/auth";
import Sidebar from "./Sidebar";
import ChatModal from "../pages/ChatModal";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const { logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-[#9878f3] shadow p-3 flex justify-between items-center">
      <div className="flex justify-center items-center">
        <Sidebar />
      </div>
      <div className="flex gap-4">
        {/* Botão de mensagens */}
        <button
          onClick={() => setChatOpen(true)}
          className="top-4 left-4 z-40 p-2 text-[#eaeffe] rounded-lg hover:bg-[#7b6ccb] hover:text-[#EAEFFE] transition"
        >
          <MessageSquareMore size={24} />
        </button>

        {/* Modal de Chat */}
        <ChatModal open={chatOpen} onClose={() => setChatOpen(false)} />

        {/* Menu do usuário */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 hover:scale-105 transition"
          >
            {user?.photoUrl ? (
              <img
                src={user.photoUrl}
                alt="Foto de perfil"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#7b6ccb]">
                <User size={24} className="text-white" />
              </div>
            )}
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50"
              >
                <div className="flex flex-col text-sm text-gray-700">
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="px-4 py-3 hover:bg-[#EAEFFE] transition"
                  >
                    Meu Perfil
                  </Link>
                  <Link
                    to="/create-listing"
                    onClick={() => setOpen(false)}
                    className="px-4 py-3 hover:bg-[#EAEFFE] transition"
                  >
                    Criar Anúncio
                  </Link>
                  <button
                    onClick={() => {
                      setOpen(false);
                      {
                        logout();
                      }
                    }}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition"
                  >
                    Sair
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
