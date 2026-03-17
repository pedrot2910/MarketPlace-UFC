import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number; // Valor entre 0 e 5
  totalReviews: number;
  interactive?: boolean; // Se for true, as estrelas podem ser clicadas para avaliar
  onRate?: (rating: number) => void; // Função chamada quando o usuário clica para avaliar
}

export function StarRating({
  rating,
  totalReviews,
  interactive = false,
  onRate,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            onClick={() => interactive && onRate && onRate(star)}
            className={`w-5 h-5 ${interactive ? "cursor-pointer transition-transform hover:scale-110" : ""} ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-transparent text-gray-300"
            }`}
          />
        ))}
      </div>
      {!interactive && totalReviews !== undefined && (
        <span className="text-sm text-gray-500 font-medium">
          {rating.toFixed(1)} ({totalReviews}{" "}
          {totalReviews === 1 ? "avaliação" : "avaliações"})
        </span>
      )}
    </div>
  );
}
