import { MessageSquareMore, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
        <div>
          <button className="top-4 left-4 z-50 p-2 text-[#eaeffe] rounded-lg hover:bg-[#7b6ccb] hover:text-[#EAEFFE] transition">
            <MessageSquareMore size={24} />
          </button>
        </div>

        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="p-2 rounded-full bg-[#9878f3] hover:bg-[#7b6ccb] text-[#EAEFFE] transition"
          >
            <User size={24} />
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
                      // Simulação de logout
                      window.location.href = "/login";
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
