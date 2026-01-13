import { MessageSquareMore, User, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/auth";
import Sidebar from "./Sidebar";
import { useInboxModal } from "../hooks/useInboxModal";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationCenter } from "./NotificationDropdown";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [openNot, setOpenNot] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const { logout } = useAuth();
  const { openInbox } = useInboxModal();
  const { unreadCount } = useNotifications();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
        setOpenNot(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-40 bg-[var(--color-primary)] shadow p-3 flex justify-between items-center">
      <div className="flex justify-center items-center">
        <Sidebar />
      </div>
      <div className="flex gap-4">
        {/* Botão de mensagens */}
        <button
          onClick={() => {
            openInbox();
          }}
          className="top-4 left-4 z-30 p-2 text-[var(--color-text-invert)] rounded-lg hover:bg-[var(--color-secondary)] transition-all duration-200"
        >
          <MessageSquareMore size={24} />
        </button>

        <div className="flex gap-4">
          {/* Botão de mensagens */}
          <button
            onClick={() => setOpenNot((prev) => !prev)}
            className="top-4 left-4 z-30 p-2 text-[var(--color-text-invert)] rounded-lg hover:bg-[var(--color-secondary)] transition-all duration-200"
          >
            <Bell size={24} />
          </button>

          {unreadCount > 0 && (
            <div className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
              {unreadCount}
            </div>
          )}

          {openNot && <NotificationCenter />}
        </div>

        {/* Menu do usuário */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 hover:scale-105 transition-all duration-200"
          >
            {user?.photoUrl ? (
              <img
                src={user.photoUrl}
                alt="Foto de perfil"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[var(--color-secundary-dark)]">
                <User size={24} className="text-[var(--color-text-invert)]" />
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
                className="absolute right-0 mt-2 w-48 bg-[var(--color-card)] rounded-lg shadow-lg overflow-hidden z-50"
              >
                <div className="flex flex-col text-sm text-[var(--color-text)]">
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="px-4 py-3 hover:bg-[var(--color-bg-alt)] transition-all duration-200"
                  >
                    Meu Perfil
                  </Link>
                  <Link
                    to="/create-listing"
                    onClick={() => setOpen(false)}
                    className="px-4 py-3 hover:bg-[var(--color-bg-alt)] transition-all duration-200"
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
                    className="w-full text-left px-4 py-3 text-[var(--color-error)] hover:bg-red-50 transition-all duration-200"
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
