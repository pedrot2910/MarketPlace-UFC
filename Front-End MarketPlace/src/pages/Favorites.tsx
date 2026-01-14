import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Loader2, ShoppingBag } from "lucide-react";
import { getFavoritesByUser, type FavoriteProduct } from "../services/favorites.service";
import { useAuth } from "../hooks/auth";

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    getFavoritesByUser(user.id)
      .then(setFavorites)
      .catch((err) => console.error("Erro ao carregar favoritos:", err))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--color-bg)] py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[var(--color-text)] mb-2 flex items-center gap-3">
            <Heart className="text-[var(--color-primary)]" size={36} />
            Meus Favoritos
          </h1>
          <p className="text-[var(--color-text-muted)]">
            {favorites.length} produto{favorites.length !== 1 ? "s" : ""} favoritado{favorites.length !== 1 ? "s" : ""}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-[var(--color-primary)] mb-4" />
            <p className="text-[var(--color-text-muted)] text-lg">Carregando favoritos...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <ShoppingBag className="h-24 w-24 text-[var(--color-text-muted)] mb-6 opacity-50" />
            <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-2">
              Nenhum favorito ainda
            </h2>
            <p className="text-[var(--color-text-muted)] mb-6 text-center max-w-md">
              Explore o marketplace e adicione produtos aos seus favoritos para vê-los aqui!
            </p>
            <Link
              to="/marketplace"
              className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              Explorar Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {favorites.map((favorite) => {
              const product = favorite.products;
              const coverImage = product.product_images[0]?.image_url;

              const conditionColors = {
                novo: "bg-green-500/10 text-green-600 border-green-500/20",
                seminovo: "bg-amber-500/10 text-amber-600 border-amber-500/20",
                usado: "bg-gray-500/10 text-gray-600 border-gray-500/20",
              };

              return (
                <Link
                  key={favorite.id}
                  to={`/listing/${product.id}`}
                  className="group relative bg-[var(--color-card)] rounded-2xl shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-[var(--color-border)]/50"
                >
                  {/* Condition Badge */}
                  <span
                    className={`absolute left-3 top-3 z-10 text-xs font-semibold rounded-lg px-2 py-1 border ${
                      conditionColors[product.condition as keyof typeof conditionColors]
                    }`}
                  >
                    {product.condition.charAt(0).toUpperCase() + product.condition.slice(1)}
                  </span>

                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={coverImage}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
                  </div>

                  <div className="p-4">
                    {/* Product Name */}
                    <h3 className="mb-3 line-clamp-2 text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                      {product.title}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs" style={{ color: "hsl(263, 20%, 45%)" }}>
                        R$
                      </span>
                      <span className="text-xl font-bold" style={{ color: "hsl(263, 70%, 50%)" }}>
                        {product.price.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
