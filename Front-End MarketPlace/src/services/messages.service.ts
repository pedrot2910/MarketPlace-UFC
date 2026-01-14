import api from "./api";
import type { Message } from "../types/message";

export async function getMessagesByUser(userId: string) {
  const { data } = await api.get<Message[]>(`/messages/user/${userId}`);
  return data;
}

export async function markMessagesAsRead(
  userId: string,
  productId: string,
  otherUserId: string
) {
  await api.put("/messages/mark-read", {
    userId,
    productId,
    otherUserId,
  });
}

export async function deleteConversation(
  userId: string,
  productId: string,
  otherUserId: string
) {
  await api.delete("/messages/conversation", {
    data: {
      userId,
      productId,
      otherUserId,
    },
  });
}
