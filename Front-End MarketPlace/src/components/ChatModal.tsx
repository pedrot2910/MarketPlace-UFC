import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowLeft, User, Phone, Video, MoreVertical } from "lucide-react";

import { chatService } from "../services/chatservice";
import { useAuth } from "../hooks/auth/useAuth";
import { useChatModal, getOtherUser } from "../hooks/useChatModal";
import { useInboxModal } from "../hooks/useInboxModal";
import { getMessagesByUser, markMessagesAsRead } from "../services/messages.service";
import { fetchProfileById } from "../services/profile";
import { getListingById } from "../services/listings";

import type { Message } from "../types/message";

export default function ChatModal() {
  const { open, close, receiverId, productId } = useChatModal();
  const { openInbox } = useInboxModal();
  const { user, token } = useAuth();
  const [otherUser, setOtherUser] = useState<any>(null);
  const [otherUserPhoto, setOtherUserPhoto] = useState<string>("");
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

        // Marcar mensagem como lida se for recebida (não enviada por mim)
        const senderId = msg.sender?.id ?? msg.sender_id;
        if (senderId === receiverId && user) {
          markMessagesAsRead(user.id, String(productId), String(receiverId))
            .then(() => console.log("✅ Nova mensagem marcada como lida"))
            .catch((err) => console.error("Erro ao marcar nova mensagem como lida:", err));
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
          // Marcar novas mensagens como lidas
          if (user) {
            markMessagesAsRead(user.id, String(productId), String(receiverId))
              .then(() => console.log("✅ Mensagens do polling marcadas como lidas"))
              .catch((err) => console.error("Erro ao marcar mensagens do polling:", err));
          }
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
        
        console.log("👤 PERFIL COMPLETO:", profile);
        
        // Buscar foto de perfil
        if (profile?.profile_images?.[0]?.image_url) {
          setOtherUserPhoto(profile.profile_images[0].image_url);
          console.log("📸 FOTO ENCONTRADA:", profile.profile_images[0].image_url);
        } else {
          console.log("⚠️ SEM FOTO DE PERFIL NO BANCO");
        }
        
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
      
      // Buscar título do produto diretamente (não depende de mensagens existentes)
      try {
        const product = await getListingById(String(productId));
        setProductTitle(product.title);
        console.log("📦 PRODUTO CARREGADO:", product.title);
      } catch (err) {
        console.error("Erro ao buscar produto:", err);
        // Fallback: tentar extrair das mensagens
        const title = filtered[0]?.product?.title ?? 'Produto';
        setProductTitle(title);
      }

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

  // Agrupar mensagens por data
  function groupMessagesByDate(messages: Message[]) {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = "";

    messages.forEach((msg) => {
      const msgDate = new Date(msg.created_at);
      // Ajustar timezone (Brasil = UTC-3)
      msgDate.setHours(msgDate.getHours() - 3);
      
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let dateLabel = "";
      
      // Normalizar datas para comparação (ignorar horas)
      const msgDateOnly = new Date(msgDate.getFullYear(), msgDate.getMonth(), msgDate.getDate());
      const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

      if (msgDateOnly.getTime() === todayOnly.getTime()) {
        dateLabel = "Hoje";
      } else if (msgDateOnly.getTime() === yesterdayOnly.getTime()) {
        dateLabel = "Ontem";
      } else {
        dateLabel = msgDate.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
        });
      }

      if (dateLabel !== currentDate) {
        currentDate = dateLabel;
        groups.push({ date: dateLabel, messages: [] });
      }

      groups[groups.length - 1].messages.push(msg);
    });

    return groups;
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* MODAL - Centralizado mas com estilo moderno */}
          <motion.div
            className="fixed z-50 top-1/2 left-1/2 w-[480px] max-w-[95%] h-[600px]
              -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{
              boxShadow: "0 8px 32px rgba(124, 92, 250, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)"
            }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            {/* HEADER com gradiente roxo */}
            <div 
              className="px-4 py-3 text-white shrink-0"
              style={{
                background: "linear-gradient(135deg, #7C5CFA 0%, #6B46E5 100%)"
              }}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    close();
                    openInbox();
                  }}
                  className="hover:bg-white/20 rounded-full p-1.5 transition-colors"
                  title="Voltar para lista de conversas"
                >
                  <ArrowLeft size={20} />
                </button>

                {/* Avatar */}
                <div className="relative">
                  {otherUserPhoto ? (
                    <img
                      src={otherUserPhoto}
                      alt={otherUser?.name || "Usuário"}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
                      <User size={20} />
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
                </div>

                {/* Nome e status */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/90 truncate">{productTitle}</p>
                  <h2 className="font-semibold truncate">
                    {otherUser ? otherUser.name : "Carregando..."}
                  </h2>
                </div>

                {/* Ações do header */}
                <div className="flex items-center gap-1">
                  <button className="hover:bg-white/20 rounded-full p-2 transition-colors">
                    <Phone size={18} />
                  </button>
                  <button className="hover:bg-white/20 rounded-full p-2 transition-colors">
                    <Video size={18} />
                  </button>
                  <button className="hover:bg-white/20 rounded-full p-2 transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* MENSAGENS */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
              {messageGroups.map((group) => (
                <div key={group.date}>
                  {/* Divisor de data */}
                  <div className="flex items-center justify-center my-4">
                    <div className="bg-white px-4 py-1 rounded-full shadow-sm">
                      <span className="text-xs text-gray-500 font-medium">
                        {group.date}
                      </span>
                    </div>
                  </div>

                  {/* Mensagens do dia */}
                  {group.messages.map((msg, index) => {
                    const senderId = msg.sender?.id ?? msg.sender_id;
                    const isMine = senderId === user?.id;
                    
                    // Criar objeto Date e ajustar timezone (Brasil = UTC-3)
                    const msgDate = new Date(msg.created_at);
                    // Subtrair 3 horas para corrigir o fuso horário
                    msgDate.setHours(msgDate.getHours() - 3);
                    
                    const time = msgDate.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    // Verificar se é a última mensagem do mesmo remetente com o mesmo horário
                    const nextMsg = group.messages[index + 1];
                    let showTime = true;
                    
                    if (nextMsg) {
                      const nextSenderId = nextMsg.sender?.id ?? nextMsg.sender_id;
                      const nextMsgDate = new Date(nextMsg.created_at);
                      nextMsgDate.setHours(nextMsgDate.getHours() - 3);
                      const nextTime = nextMsgDate.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      
                      // Ocultar horário se próxima mensagem for do mesmo remetente e mesmo horário
                      if (senderId === nextSenderId && time === nextTime) {
                        showTime = false;
                      }
                    }

                    return (
                      <div
                        key={msg.id}
                        className={`mb-3 flex items-end gap-2 ${
                          isMine ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        {/* Avatar (só para mensagens do outro usuário) */}
                        {!isMine && (
                          <div className="shrink-0 mb-1">
                            {otherUserPhoto ? (
                              <img
                                src={otherUserPhoto}
                                alt={otherUser?.name || "Usuário"}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            ) : (
                              <div 
                                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                                style={{ backgroundColor: "#7C5CFA" }}
                              >
                                <User size={14} />
                              </div>
                            )}
                          </div>
                        )}

                        {/* Mensagem */}
                        <div className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                          <div
                            className={`px-4 py-2 rounded-2xl max-w-[320px] shadow-sm ${
                              isMine
                                ? "text-white"
                                : "bg-white text-gray-800"
                            }`}
                            style={isMine ? {
                              background: "linear-gradient(135deg, #7C5CFA 0%, #6B46E5 100%)"
                            } : {}}
                          >
                            <p className="text-sm leading-relaxed break-words">
                              {msg.message}
                            </p>
                          </div>
                          {showTime && (
                            <span className="text-[11px] text-gray-400 mt-1 px-1">
                              {time}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>

            {/* INPUT */}
            <div className="shrink-0 p-4 bg-white border-t">
              <div className="flex gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Digite uma mensagem..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C5CFA] focus:ring-2 focus:ring-[#7C5CFA]/20"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                  }}
                />

                <button
                  onClick={handleSend}
                  className="p-3 text-white rounded-full transition-all hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #7C5CFA 0%, #6B46E5 100%)"
                  }}
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
