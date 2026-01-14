import type { Message } from "./message";

export interface ChatThread {
  productId: string;
  otherUserId: string;
  otherUsername: string;
  lastMessage: Message;
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

    const key = `${productId}:${otherUserId}`;

    if (!map.has(key)) {
      map.set(key, {
        productId,
        otherUserId,
        otherUsername: msg.sender?.name ?? msg.receiver?.name,
        lastMessage: msg,
      });
    } else {
      const thread = map.get(key)!;
      const prev = new Date(thread.lastMessage.created_at).getTime();
      const curr = new Date(msg.created_at).getTime();

      if (curr > prev) {
        thread.lastMessage = msg;
      }
    }
  }

  return Array.from(map.values()).sort(
    (a, b) =>
      new Date(b.lastMessage.created_at).getTime() -
      new Date(a.lastMessage.created_at).getTime()
  );
}