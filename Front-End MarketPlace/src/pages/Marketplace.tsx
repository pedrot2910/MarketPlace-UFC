import { useEffect, useState } from "react";
import { fetchListings } from "../services/listings";
import { Link, useSearchParams } from "react-router-dom";
import type { Product } from "../types/product";

export default function Marketplace() {
  const [listings, setListings] = useState<Product[]>([]);
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") ?? "all";
  const searchQuery = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";

  useEffect(() => {
    fetchListings().then(setListings);
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.length > 0 ? (
            filteredListings.map((listing) => {
              const coverImage = listing.product_images.find(
                (img) => img.is_cover
              )?.image_url;

              return (
                <div
                  key={listing.id}
                  className="bg-[var(--color-card)] rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  <img
                    src={coverImage}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-6 text-left">
                    <h2 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                      {listing.title}
                    </h2>

                    <p className="text-[var(--color-text-muted)] mb-4 line-clamp-2">
                      {listing.description}
                    </p>

                    <div className="flex gap-2 mb-3">
                      <span
                        className={`text-xs font-semibold rounded-full px-3 py-1 ${
                          listing.type === "venda"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {listing.type === "venda" ? "Venda" : "Troca"}
                      </span>
                      <span className="text-xs font-semibold rounded-full px-3 py-1 bg-gray-100 text-gray-700 capitalize">
                        {listing.condition}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[var(--color-primary)] font-bold text-lg">
                        R$ {listing.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>

                      <Link
                        to={`/listing/${listing.id}`}
                        className="bg-[var(--color-secondary-dark)] hover:bg-[var(--color-secondary)] text-[var(--color-text-invert)] px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-[var(--color-text-muted)] col-span-full">
              Nenhum anúncio disponível no momento.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
