import { MessageSquareMore, User, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/auth";
import Sidebar from "./Sidebar";
import { useInboxModal } from "../hooks/useInboxModal";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationCenter } from "./NotificationDropdown";
import { getProfileImage } from "../services/profile";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [openNot, setOpenNot] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const { logout } = useAuth();
  const { openInbox } = useInboxModal();
  const { unreadCount } = useNotifications();
  const notRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadProfileImage() {
      if (user?.id) {
        try {
          const imageData = await getProfileImage(user.id);
          if (imageData?.imageUrl) {
            setProfileImageUrl(imageData.imageUrl);
          } else {
            setProfileImageUrl(null);
          }
        } catch (err) {
          console.log("Sem foto de perfil");
          setProfileImageUrl(null);
        }
      }
    }
    loadProfileImage();

    // Escutar evento de atualização de foto
    const handleProfileImageUpdate = () => {
      loadProfileImage();
    };
    window.addEventListener('profileImageUpdated', handleProfileImageUpdate);

    return () => {
      window.removeEventListener('profileImageUpdated', handleProfileImageUpdate);
    };
  }, [user?.id]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (ref.current && !ref.current.contains(target)) {
        setOpen(false);
      }

      if (notRef.current && !notRef.current.contains(target)) {
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

        <div className="flex gap-4 relative" ref={notRef}>
          {/* Botão de mensagens */}
          <button
            onClick={() => setOpenNot((prev) => !prev)}
            className="z-30 p-2 text-[var(--color-text-invert)] rounded-lg hover:bg-[var(--color-secondary)] transition-all duration-200 relative"
          >
            <Bell size={24} />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {openNot && <NotificationCenter />}
        </div>

        {/* Menu do usuário */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => {
              setOpen((prev) => !prev);
              setOpenNot(false);
            }}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 hover:scale-105 transition-all duration-200"
          >
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
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
