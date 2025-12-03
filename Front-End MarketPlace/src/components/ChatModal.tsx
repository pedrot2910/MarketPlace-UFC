import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Trash2 } from "lucide-react";
import { chatService } from "../services/chatservice";
import { useAuth } from "../hooks/auth/useAuth";
import { useChatModal } from "../hooks/useChatModal";
import { getUserById } from "../services/api";

export default function ChatModal() {
  const { open, threadId, close } = useChatModal();
  const { user } = useAuth();
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [message, setMessage] = useState("");
  const [otherUserName, setOtherUserName] = useState<string>("");

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const handleDeleteChat = (chatId: string) => {
    chatService.deleteThread(chatId);

    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
  };

  useEffect(() => {
    if (!open || !user) return;

    const result = chatService.listUserChats(Number(user.id));
    setChats(result);

    if (threadId) {
      const chat = result.find((c) => c.id === threadId);
      if (chat) setSelectedChat(chat);
    } else {
      setSelectedChat(null);
    }
  }, [open, threadId, user]);

  useEffect(() => {
    if (!selectedChat || !user) return;

    const currentUserId = Number(user.id);

    const otherUserId =
      selectedChat.buyerId === currentUserId
        ? selectedChat.sellerId
        : selectedChat.buyerId;

    const other = getUserById(Number(otherUserId));
    setOtherUserName(other ? other.name : `Usuário #${otherUserId}`);
  }, [selectedChat, user]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat?.messages]);

  useEffect(() => {
    if (open && user && typeof user.id === "number") {
      const result = chatService.listUserChats(user.id);
      setChats(result);
    }
  }, [open, user]);

  function handleSelectChat(chatId: string) {
    const chat = chats.find((c) => c.id === chatId);
    setSelectedChat(chat || null);
  }

  function handleSendMessage() {
    if (!selectedChat || !message.trim() || !user) return;

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
            onClick={close}
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
                onClick={close}
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

                <AnimatePresence>
                  {chats.map((chat) => {
                    const currentUserId = Number(user?.id);
                    const otherUserId =
                      chat.buyerId === currentUserId
                        ? chat.sellerId
                        : chat.buyerId;

                    const otherUser = getUserById(otherUserId);
                    const chatName =
                      otherUser?.name ?? `Usuário #${otherUserId}`;

                    return (
                      <motion.div
                        key={chat.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.22 }}
                      >
                        <div
                          onClick={() => handleSelectChat(chat.id)}
                          className="p-3 rounded-xl bg-[#EAEFFE] hover:bg-[#D7D0FF] transition text-left shadow-sm flex justify-between items-center"
                        >
                          <div>
                            <p className="font-semibold text-[#4b3a91]">
                              Conversa com {chatName}
                            </p>
                            <p className="text-sm text-gray-600 truncate max-w-[220px]">
                              {chat.messages.at(-1)?.text ||
                                "Sem mensagens ainda"}
                            </p>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChat(chat.id);
                            }}
                            className="text-red-500 hover:text-red-700 p-2 transition"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
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
                        msg.from === Number(user?.id)
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl max-w-[70%] shadow-sm ${
                          msg.from === Number(user?.id)
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
