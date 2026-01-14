import { useEffect, useState } from "react";
import { fetchListings } from "../services/listings";
import { Link, useSearchParams } from "react-router-dom";
import { Eye, Loader2 } from "lucide-react";
import type { Product } from "../types/product";

export default function Marketplace() {
  const [listings, setListings] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") ?? "all";
  const searchQuery = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";

  useEffect(() => {
    setLoading(true);
    fetchListings()
      .then(setListings)
      .finally(() => setLoading(false));
  }, []);

  const filteredListings = listings.filter((listing) => {
    // Filtro por modo (venda/troca)
    const matchesMode = mode === "all" || listing.type === mode;

    // Filtro por busca de texto
    const matchesSearch =
      searchQuery === "" ||
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (listing.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false);

    // Filtro por categoria - compara com o campo namecategories
    const matchesCategory =
      category === "" ||
      listing.categories?.namecategories?.toLowerCase() ===
        category.toLowerCase();

    return matchesMode && matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--color-bg)] py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[var(--color-text)] mb-10 text-center">
          Marketplace <span className="text-[var(--color-primary)]">ReUse</span>
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-[var(--color-primary)] mb-4" />
            <p className="text-[var(--color-text-muted)] text-lg">Carregando anúncios...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredListings.length > 0 ? (
              filteredListings.map((listing) => {
              const coverImage = listing.product_images.find(
                (img) => img.is_cover
              )?.image_url || listing.product_images[0]?.image_url;

              const conditionColors = {
                novo: "bg-green-500/10 text-green-600 border-green-500/20",
                seminovo: "bg-amber-500/10 text-amber-600 border-amber-500/20",
                usado: "bg-gray-500/10 text-gray-600 border-gray-500/20",
              };

              return (
                <div
                  key={listing.id}
                  className="group relative bg-[var(--color-card)] rounded-2xl shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-[var(--color-border)]/50"
                  onMouseEnter={() => setHoveredId(listing.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Condition Badge */}
                  <span className={`absolute left-3 top-3 z-10 text-xs font-semibold rounded-lg px-2 py-1 border ${
                    conditionColors[listing.condition as keyof typeof conditionColors]
                  }`}>
                    {listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1)}
                  </span>

                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={coverImage}
                      alt={listing.title}
                      className={`h-full w-full object-cover transition-transform duration-500 ${
                        hoveredId === listing.id ? "scale-110" : "scale-100"
                      }`}
                    />
                    
                    {/* Overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
                      hoveredId === listing.id ? "opacity-100" : "opacity-0"
                    }`} />
                  </div>

                  <div className="p-4">
                    {/* Product Name */}
                    <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                      {listing.title}
                    </h3>

                    {/* Location & Seller */}
                    <p className="mb-3 text-xs text-muted-foreground">
                      Sobral, CE • {listing.profiles?.name ?? "Vendedor"}
                    </p>

                    {/* Type Badge */}
                    <div className="mb-4">
                      <span
                        className={`text-xs font-semibold rounded-full px-2.5 py-1 ${
                          listing.type === "venda"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {listing.type === "venda" ? "Venda" : "Troca"}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mb-4 flex items-baseline gap-1">
                      <span className="text-xs" style={{ color: 'hsl(263, 20%, 45%)' }}>R$</span>
                      <span className="text-xl font-bold" style={{ color: 'hsl(263, 70%, 50%)' }}>
                        {listing.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Action Button */}
                    <Link
                      to={`/listing/${listing.id}`}
                      className="w-full flex items-center justify-center gap-2 bg-[var(--color-secondary-dark)] hover:bg-[var(--color-secondary)] text-[var(--color-text-invert)] px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 hover:shadow-md hover:shadow-[var(--color-primary)]/20"
                    >
                      <Eye className="h-4 w-4" />
                      Ver Detalhes
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-[var(--color-text-muted)] col-span-full py-10 text-lg">
              Nenhum anúncio disponível no momento.
            </p>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
