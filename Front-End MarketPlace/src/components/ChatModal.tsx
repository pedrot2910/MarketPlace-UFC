import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, ArrowLeft } from "lucide-react";

import { chatService } from "../services/chatservice";
import { useAuth } from "../hooks/auth/useAuth";
import { useChatModal, getOtherUser } from "../hooks/useChatModal";
import { useInboxModal } from "../hooks/useInboxModal";
import { getMessagesByUser, markMessagesAsRead } from "../services/messages.service";
import { fetchProfileById } from "../services/profile";

import type { Message } from "../types/message";

export default function ChatModal() {
  const { open, close, receiverId, productId } = useChatModal();
  const { openInbox } = useInboxModal();
  const { user, token } = useAuth();
  const [otherUser, setOtherUser] = useState<any>(null);
  const [productTitle, setProductTitle] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const otherUserRef = useRef<any>(null);

  /**
   * 1. Conecta socket quando abrir modal
   */
  useEffect(() => {
    if (!open) return;
    if (!token) return;
    if (!user) return;
    if (!receiverId || !productId) return;
    chatService.connect(token);

    chatService.joinChat({
      sender_id: user.id,
      receiver_id: String(receiverId),
      product_id: String(productId),
    });

    function handleNewMessage(msg: Message) {
      console.log("📩 NOVA MENSAGEM RECEBIDA:", msg);
      setMessages((prev) => {
        // Evitar mensagens duplicadas
        const exists = prev.some((m) => m.id === msg.id);
        if (exists) return prev;

        const updated = [...prev, msg];

        if (!otherUserRef.current) {
          const other = getOtherUser(updated, user!.id);
          otherUserRef.current = other;
          setOtherUser(other);
        }

        return updated;
      });
    }

    chatService.onMessage(handleNewMessage);

    // Polling como fallback para garantir que as mensagens sejam atualizadas
    const pollInterval = setInterval(async () => {
      if (!user) return;
      const allMessages = await getMessagesByUser(user.id);

      const filtered = allMessages
        .filter((msg) => {
          const senderId = msg.sender?.id;
          const receiverIdMsg = msg.receiver?.id;
          const productIdMsg = msg.product_id ?? msg.product?.id;

          if (!senderId || !receiverIdMsg || !productIdMsg) return false;

          const isSameProduct = productIdMsg === productId;

          const isSameUsers =
            (senderId === user.id && receiverIdMsg === receiverId) ||
            (senderId === receiverId && receiverIdMsg === user.id);

          return isSameProduct && isSameUsers;
        })
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

      setMessages((prev) => {
        // Só atualiza se houver novas mensagens
        if (filtered.length > prev.length) {
          return filtered;
        }
        return prev;
      });
    }, 3000); // Verifica a cada 3 segundos

    return () => {
      clearInterval(pollInterval);
      chatService.offMessage(handleNewMessage);
      // Não desconecta o socket pois as notificações também usam
    };
  }, [open, user, token, receiverId, productId]);

  useEffect(() => {
    if (!open) return;
    if (!user || !receiverId || !productId) return;

    async function loadHistory() {
      if (!user) return;
      console.log("📜 CARREGANDO HISTÓRICO", { receiverId, productId });

      // Buscar o perfil do outro usuário diretamente
      try {
        const profile = await fetchProfileById(String(receiverId));
        setOtherUser(profile);
        console.log("👤 PERFIL DO OUTRO USUÁRIO:", profile);
      } catch (err) {
        console.error("Erro ao buscar perfil:", err);
      }

      const allMessages = await getMessagesByUser(user.id);

      const filtered = allMessages
        .filter((msg) => {
          const senderId = msg.sender?.id;
          const receiverIdMsg = msg.receiver?.id;
          const productIdMsg = msg.product_id ?? msg.product?.id;

          if (!senderId || !receiverIdMsg || !productIdMsg) return false;

          const isSameProduct = productIdMsg === productId;

          const isSameUsers =
            (senderId === user.id && receiverIdMsg === receiverId) ||
            (senderId === receiverId && receiverIdMsg === user.id);

          return isSameProduct && isSameUsers;
        })
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

      console.log("📜 HISTÓRICO FILTRADO:", filtered);

      setMessages(filtered);
      
      // Extrair título do produto
      const title = filtered[0]?.product?.title ?? 'Produto';
      setProductTitle(title);

      // Marcar mensagens como lidas
      try {
        await markMessagesAsRead(user.id, String(productId), String(receiverId));
        console.log("✅ Mensagens marcadas como lidas");
      } catch (err) {
        console.error("Erro ao marcar mensagens como lidas:", err);
      }
    }

    setMessages([]);
    loadHistory();
  }, [open, user, receiverId, productId]);

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
    console.log("🧪 HANDLE SEND", { text, receiverId, productId });

    if (!text.trim() || !receiverId || !productId) {
      console.warn("⛔ BLOQUEADO NO HANDLESEND");
      return;
    }

    chatService.sendMessage({
      receiver_id: String(receiverId),
      product_id: String(productId),
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
              <button
                onClick={() => {
                  close();
                  openInbox();
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
                title="Voltar para lista de conversas"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              
              <div className="flex flex-col flex-1 mx-3">
                <span className="text-xs text-gray-500">Anúncio: {productTitle || "Carregando..."}</span>
                <h2 className="text-lg font-semibold text-[#4b3a91]">
                  {otherUser ? otherUser.name : "Carregando..."}
                </h2>
              </div>

              <button onClick={close}>
                <X size={22} />
              </button>
            </div>

            {/* MENSAGENS */}
            <div className="flex flex-col h-80">
              <div className="flex-1 overflow-y-auto border rounded-xl p-3 mb-3 bg-[#F6F4FF]">
                {messages.map((msg) => {
                  const senderId = msg.sender?.id ?? msg.sender_id;
                  const isMine = senderId === user?.id;

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
