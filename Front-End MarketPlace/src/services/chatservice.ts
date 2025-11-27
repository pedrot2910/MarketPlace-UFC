
// src/services/chatservice.ts

export type Message = {
  id: string;
  from: number;
  text: string;
  timestamp: number;
};

export type ChatThread = {
  id: string;
  buyerId: number;
  sellerId: number;
  productId: number;
  messages: Message[];
};

const STORAGE_KEY = "mock_chat_db_marketplace";

// ------- CARREGAR / SALVAR ---------

function loadDB(): ChatThread[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDB(db: ChatThread[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

let chatDB: ChatThread[] = loadDB();

// --------- SERVIÇO PRINCIPAL ---------

export const chatService = {
  /** Retorna OU cria uma thread entre comprador, vendedor e anúncio */
  getOrCreateThread(
    buyerId: number,
    sellerId: number,
    productId: number
  ): ChatThread {
    let thread = chatDB.find(
      (t) =>
        t.buyerId === buyerId &&
        t.sellerId === sellerId &&
        t.productId === productId
    );

    if (!thread) {
      thread = {
        id: crypto.randomUUID(),
        buyerId,
        sellerId,
        productId,
        messages: [],
      };

      chatDB.push(thread);
      saveDB(chatDB);
    }

    return thread;
  },

  /** Envia mensagem e salva */
  sendMessage(threadId: string, from: number, text: string) {
    const thread = chatDB.find((t) => t.id === threadId);
    if (!thread) return null;

    const msg: Message = {
      id: crypto.randomUUID(),
      from,
      text,
      timestamp: Date.now(),
    };

    thread.messages.push(msg);
    saveDB(chatDB);

    return msg;
  },

  /** Lista todas as conversas do usuário (buyer ou seller) */
  listUserChats(userId: number) {
    return chatDB.filter(
      (t) => t.buyerId === userId || t.sellerId === userId
    );
  },

  clearAll() {
    chatDB = [];
    saveDB(chatDB);
  },
};
