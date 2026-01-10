export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  product_id: string;
  message: string;
  image_url?: string | null;
  created_at: string;
}
