import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";

import { chatService } from "../services/chatservice";
import { useAuth } from "../hooks/auth/useAuth";
import { useChatModal } from "../hooks/useChatModal";

import type { Message } from "../types/message";

export default function ChatModal() {
  const { open, close, receiverId, productId } = useChatModal();
  const { user, token } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  /**
   * 1. Conecta socket quando abrir modal
   */
  useEffect(() => {
    if (!open || !token) return;

    chatService.connect(token);

    return () => {
      chatService.disconnect();
    };
  }, [open, token]);

  /**
   * 2. Entra na sala do chat
   */
  useEffect(() => {
    if (!open || !user || !receiverId || !productId) return;

    chatService.joinChat({
      sender_id: user.id,
      receiver_id: receiverId,
      product_id: productId,
    });
  }, [open, user, receiverId, productId]);

  /**
   * 3. Escuta mensagens
   */
  useEffect(() => {
    function handleNewMessage(msg: Message) {
      setMessages((prev) => [...prev, msg]);
    }

    chatService.onMessage(handleNewMessage);

    return () => {
      chatService.offMessage(handleNewMessage);
    };
  }, []);

  /**
   * 4. Auto-scroll
   */
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * 5. Enviar mensagem
   */
  function handleSend() {
    if (!text.trim() || !receiverId || !productId) return;

    chatService.sendMessage({
      receiver_id: receiverId,
      product_id: productId,
      message: text,
    });

    setText("");
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* MODAL */}
          <motion.div
            className="fixed z-50 top-1/2 left-1/2 w-[420px] max-w-[95%]
              -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-5"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center border-b pb-2 mb-3">
              <h2 className="text-lg font-semibold text-[#4b3a91]">Chat</h2>

              <button onClick={close}>
                <X size={22} />
              </button>
            </div>

            {/* MENSAGENS */}
            <div className="flex flex-col h-80">
              <div className="flex-1 overflow-y-auto border rounded-xl p-3 mb-3 bg-[#F6F4FF]">
                {messages.map((msg) => {
                  const isMine = msg.sender_id === user?.id;

                  return (
                    <div
                      key={msg.id}
                      className={`mb-2 flex ${
                        isMine ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl max-w-[70%] shadow-sm ${
                          isMine
                            ? "bg-[#7C5CFA] text-white"
                            : "bg-white border text-[#4b3a91]"
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })}
                <div ref={messageEndRef} />
              </div>

              {/* INPUT */}
              <div className="flex gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Digite uma mensagem..."
                  className="flex-1 border rounded-xl px-3 py-2 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                  }}
                />

                <button
                  onClick={handleSend}
                  className="p-3 bg-[#7C5CFA] text-white rounded-xl"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
