import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { chatService } from "../services/chatservice";
import { useAuth } from "../hooks/auth/useAuth";

interface ChatModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ChatModal({ open, onClose }: ChatModalProps) {
  const { user } = useAuth();
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [message, setMessage] = useState("");

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  // Rolagem automática
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat?.messages]);

  // Carregar chats do usuário logado
  useEffect(() => {
    if (open && user && typeof user.id === "number") {
      const result = chatService.listUserChats(user.id);
      setChats(result);
    }
  }, [open, user]);

  function handleSelectChat(otherUserId: number) {
    if (!user) return;

    const chat = chats.find(
      (c) =>
        c.users.includes(Number(user.id)) &&
        c.users.includes(Number(otherUserId))
    );
    setSelectedChat(chat);
  }

  function handleSendMessage() {
    if (!selectedChat || !message.trim() || !user) return;

    const otherUser = selectedChat.users.find(
      (u: number) => u !== Number(user.id)
    );
    const newMsg = chatService.sendMessage(
      selectedChat.id,
      Number(user.id),
      message
    );

    setSelectedChat((prev: any) => ({
      ...prev,
      messages: [...prev.messages, newMsg],
    }));

    setMessage("");
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed z-50 top-1/2 left-1/2 w-[400px] max-w-[95%] 
              -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-5"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center border-b pb-2 mb-3">
              <h2 className="text-lg font-semibold text-[#4b3a91] flex items-center gap-2">
                Conversas
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700 transition"
                onClick={onClose}
              >
                <X size={22} />
              </button>
            </div>

            {/* LISTA DE CHATS */}
            {!selectedChat && (
              <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
                {chats.length === 0 && (
                  <p className="text-center text-sm text-gray-500">
                    Nenhuma conversa ainda
                  </p>
                )}

                {chats.map((chat, index) => {
                  const otherUserId =
                    chat.users.find((id: number) => id !== Number(user?.id)) ??
                    -1;

                  return (
                    <button
                      key={index}
                      onClick={() => handleSelectChat(otherUserId)}
                      className="p-3 rounded-xl bg-[#EAEFFE] hover:bg-[#D7D0FF] transition text-left shadow-sm"
                    >
                      <p className="font-semibold text-[#4b3a91]">
                        Conversa com usuário #{otherUserId}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {chat.messages.at(-1)?.text || "Sem mensagens ainda"}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}

            {/* CHAT ABERTO */}
            {selectedChat && (
              <div className="flex flex-col h-80">
                {/* MENSAGENS */}
                <div className="flex-1 overflow-y-auto border rounded-xl p-3 mb-3 bg-[#F6F4FF]">
                  {selectedChat.messages.map((msg: any) => (
                    <div
                      key={msg.id}
                      className={`mb-2 flex ${
                        msg.from === user?.id ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl max-w-[70%] shadow-sm ${
                          msg.from === user?.id
                            ? "bg-[#7C5CFA] text-white"
                            : "bg-white border text-[#4b3a91]"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={messageEndRef} />
                </div>

                {/* INPUT */}
                <div className="flex gap-2">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Digite uma mensagem..."
                    className="flex-1 border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#7C5CFA]"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-3 bg-[#7C5CFA] hover:bg-[#6E52E0] text-white rounded-xl shadow transition"
                  >
                    <Send size={18} />
                  </button>
                </div>

                {/* VOLTAR */}
                <button
                  onClick={() => setSelectedChat(null)}
                  className="text-sm text-gray-500 mt-3 hover:text-[#4b3a91] transition"
                >
                  ← Voltar às conversas
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
