import type { Message } from "./message";

export interface ChatThread {
  productId: string;
  productTitle: string;
  otherUserId: string;
  otherUsername: string;
  lastMessage: Message;
  unreadCount: number;
}

export function buildThreads(
  messages: any[],
  currentUserId: string
): ChatThread[] {
  const map = new Map<string, ChatThread>();

  for (const msg of messages) {
    const productId =
      msg.product_id ??
      msg.productId ??
      msg.product?.id;

    const senderId =
      msg.sender_id ??
      msg.senderId ??
      msg.sender?.id;

    const receiverId =
      msg.receiver_id ??
      msg.receiverId ??
      msg.receiver?.id;

    if (!productId || !senderId || !receiverId) {
      console.warn("MSG IGNORADA (estrutura):", msg);
      continue;
    }

    const isSender = String(senderId) === String(currentUserId);
    const otherUserId = isSender ? receiverId : senderId;
    const otherUsername = isSender ? msg.receiver?.name : msg.sender?.name;

    const key = `${productId}:${otherUserId}`;

    if (!map.has(key)) {
      map.set(key, {
        productId,
        productTitle: msg.product?.title ?? 'Produto',
        otherUserId,
        otherUsername: otherUsername ?? 'Usuário',
        lastMessage: msg,
        unreadCount: 0,
      });
    } else {
      const thread = map.get(key)!;
      const prev = new Date(thread.lastMessage.created_at).getTime();
      const curr = new Date(msg.created_at).getTime();

      if (curr > prev) {
        thread.lastMessage = msg;
      }
    }

    // Contar mensagens não lidas (recebidas pelo usuário atual)
    const isReceived = String(receiverId) === String(currentUserId);
    if (isReceived && !msg.read_at) {
      const thread = map.get(key)!;
      thread.unreadCount++;
    }
  }

  return Array.from(map.values()).sort(
    (a, b) =>
      new Date(b.lastMessage.created_at).getTime() -
      new Date(a.lastMessage.created_at).getTime()
  );
}