import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, User, Search } from "lucide-react";

import { useInboxModal } from "../hooks/useInboxModal";
import { useChatModal } from "../hooks/useChatModal";
import { useAuth } from "../hooks/auth/useAuth";
import { getMessagesByUser } from "../services/messages.service";
import { buildThreads, type ChatThread } from "../types/chat-thread";
import { fetchProfileById } from "../services/profile";

export default function InboxModal() {
  const { open, closeInbox } = useInboxModal();
  const { openChat } = useChatModal();
  const { user } = useAuth();

  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [profileImages, setProfileImages] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open || !user) return;

    async function load() {
      setLoading(true);
      const messages = await getMessagesByUser(user!.id);
      const threads = buildThreads(messages, user!.id);
      setThreads(threads);

      // Buscar fotos de perfil dos conversantes
      const images: Record<string, string> = {};
      for (const thread of threads) {
        try {
          const profile = await fetchProfileById(thread.otherUserId);
          if (profile?.profile_images?.[0]?.image_url) {
            images[thread.otherUserId] = profile.profile_images[0].image_url;
          }
        } catch (err) {
          console.log("Erro ao carregar foto de perfil:", err);
        }
      }
      setProfileImages(images);
      setLoading(false);
    }

    load();

    // Polling para atualizar lista em tempo real
    const pollInterval = setInterval(async () => {
      if (!user) return;
      const messages = await getMessagesByUser(user.id);
      const threads = buildThreads(messages, user.id);
      setThreads(threads);
    }, 3000); // Verifica a cada 3 segundos

    return () => {
      clearInterval(pollInterval);
    };
  }, [open, user]);

  const filteredThreads = threads.filter((thread) =>
    thread.otherUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thread.productTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={closeInbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* MODAL - Canto inferior direito */}
          <motion.div
            className="fixed z-50 bottom-6 right-6 w-[380px] bg-white rounded-2xl shadow-2xl overflow-hidden"
            style={{
              boxShadow: "0 8px 32px rgba(124, 92, 250, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)"
            }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            {/* HEADER com gradiente roxo */}
            <div 
              className="px-4 py-3 text-white"
              style={{
                background: "linear-gradient(135deg, #7C5CFA 0%, #6B46E5 100%)"
              }}
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <MessageCircle size={20} /> Conversas
                </h2>

                <button 
                  onClick={closeInbox}
                  className="hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Barra de busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={16} />
                <input
                  type="text"
                  placeholder="Buscar conversas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60
                    border border-white/30 focus:outline-none focus:border-white/50 focus:bg-white/25"
                />
              </div>
            </div>

            {/* LISTA DE CONVERSAS */}
            <div className="max-h-[500px] overflow-y-auto">
              {!loading && filteredThreads.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  {searchTerm ? "Nenhuma conversa encontrada." : "Você ainda não tem conversas."}
                </div>
              )}

              {filteredThreads.map((thread) => (
                <div
                  key={thread.productId + thread.otherUserId}
                  onClick={() => {
                    closeInbox();
                    openChat({
                      receiverId: thread.otherUserId,
                      productId: thread.productId,
                    });
                  }}
                  className="cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start gap-3 p-4">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      {profileImages[thread.otherUserId] ? (
                        <img
                          src={profileImages[thread.otherUserId]}
                          alt={thread.otherUsername}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                          style={{ backgroundColor: "#7C5CFA" }}
                        >
                          <User size={24} />
                        </div>
                      )}
                      
                      {/* Indicador online (ponto verde) */}
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    </div>

                    {/* Conteúdo da conversa */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 truncate">
                            {thread.productTitle}
                          </p>
                          <p className="font-semibold text-gray-900 truncate">
                            {thread.otherUsername}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="text-[11px] text-gray-400">
                            {new Date(thread.lastMessage.created_at).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit'
                            })}
                          </span>
                          
                          {thread.unreadCount > 0 && (
                            <span 
                              className="text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center"
                              style={{ backgroundColor: "#6B46E5" }}
                            >
                              {thread.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 truncate">
                        {thread.lastMessage.sender?.id === user?.id && (
                          <span className="font-medium">Você: </span>
                        )}
                        {thread.lastMessage.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
