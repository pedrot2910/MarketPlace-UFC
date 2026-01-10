import type { Message } from "./message";

export interface ChatThread {
  threadId: string;
  productId: string;
  otherUserId: string;
  messages: Message[];
}
