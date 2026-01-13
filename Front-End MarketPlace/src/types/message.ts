export interface Message {
  id: string;
  message: string;
  created_at: string;

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
  };

  product_id?: string;
}
