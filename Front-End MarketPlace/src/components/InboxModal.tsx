import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";

import { useInboxModal } from "../hooks/useInboxModal";
import { useChatModal } from "../hooks/useChatModal";
import { useAuth } from "../hooks/auth/useAuth";
import { getMessagesByUser } from "../services/messages.service";
import { buildThreads, type ChatThread } from "../types/chat-thread";

export default function InboxModal() {
  const { open, closeInbox } = useInboxModal();
  const { openChat } = useChatModal();
  const { user } = useAuth();

  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open || !user) return;

    async function load() {
      setLoading(true);
      const messages = await getMessagesByUser(user!.id);
      const threads = buildThreads(messages, user!.id);
      setThreads(threads);
      setLoading(false);
    }

    load();
  }, [open, user]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={closeInbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* MODAL */}
          <motion.div
            className="fixed z-50 top-1/2 left-1/2 w-[420px] max-w-[95%]
              -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-4"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center border-b pb-2 mb-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <MessageCircle size={18} /> Conversas
              </h2>

              <button onClick={closeInbox}>
                <X size={22} />
              </button>
            </div>

            {/* LISTA */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {loading && <p>Carregando...</p>}

              {!loading && threads.length === 0 && (
                <p className="text-sm text-gray-500">
                  Você ainda não tem conversas.
                </p>
              )}

              {threads.map((thread) => (
                <div
                  key={thread.productId + thread.otherUserId}
                  onClick={() => {
                    closeInbox();
                    openChat({
                      receiverId: thread.otherUserId,
                      productId: thread.productId,
                    });
                  }}
                  className="cursor-pointer border rounded-xl p-3 hover:bg-gray-50"
                >
                  <p className="text-sm font-medium truncate">
                    {thread.lastMessage.message}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(thread.lastMessage.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
