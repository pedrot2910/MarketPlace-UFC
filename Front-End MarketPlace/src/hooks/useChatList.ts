import { useEffect, useState } from "react";
import { getMessagesByUser } from "../services/messages.service";
import { buildThreads } from "../types/chat-thread";
import type { ChatThread } from "../types/chat-thread";

export function useChatList(currentUserId: string) {
  const [threads, setThreads] = useState<ChatThread[]>([]);

  useEffect(() => {
    async function load() {
      const messages = await getMessagesByUser(currentUserId);
      const threads = buildThreads(messages, currentUserId);
      setThreads(threads);
    }

    load();
  }, [currentUserId]);

  return { threads };
}
