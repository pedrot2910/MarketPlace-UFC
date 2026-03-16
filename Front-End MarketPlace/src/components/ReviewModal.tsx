import { useState } from "react";
import { X, Star } from "lucide-react";
import api from "../services/api";

interface ReviewModalProps {
  sellerId: string;
  productId: string;
  sellerName?: string;
  onClose: () => void;
}

export function ReviewModal({
  sellerId,
  productId,
  sellerName,
  onClose,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return alert("Selecione pelo menos 1 estrela!");

    try {
      setLoading(true);
      await api.post("/reviews", {
        seller_id: sellerId,
        product_id: productId,
        rating,
        comment,
      });
      alert("Avaliação enviada com sucesso!");
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || "Erro ao avaliar vendedor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-2xl font-bold text-gray-800 text-center mb-1">
          Avaliar Vendedor
        </h3>
        <p className="text-gray-500 text-center mb-6">
          Como foi negociar com{" "}
          <span className="font-semibold text-[var(--color-primary)]">
            {sellerName || "este vendedor"}
          </span>
          ?
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex justify-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => setRating(star)}
                className={`w-10 h-10 cursor-pointer transition-all hover:scale-110 ${
                  star <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-transparent text-gray-300"
                }`}
              />
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Deixe um comentário sobre a negociação (opcional)..."
            className="w-full p-4 border border-gray-200 rounded-xl resize-none h-28 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            maxLength={500}
          />

          <button
            type="submit"
            disabled={loading || rating === 0}
            className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Enviando..." : "Enviar Avaliação"}
          </button>
        </form>
      </div>
    </div>
  );
}
