export interface Message {
  id: string;
  message: string;
  created_at: string;
  read_at?: string | null;

  sender: {
    id: string;
    name: string;
  };

  receiver: {
    id: string;
    name: string;
  };

  product?: {
    id: string;
    title?: string;
  };

  product_id?: string;
  sender_id?: string;
  receiver_id?: string;
}
