import { useEffect, useState } from "react";
import { fetchListings } from "../services/listings";
import { Link, useSearchParams } from "react-router-dom";
import type { Product } from "../types/product";

export default function Marketplace() {
  const [listings, setListings] = useState<Product[]>([]);
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") ?? "all";

  useEffect(() => {
    fetchListings().then(setListings);
  }, []);

  const filteredListings = listings.filter((listing) => {
    if (mode === "all") return true;
    return listing.type === mode; // agora "venda" | "troca"
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#EAEFFE] py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#2d274B] mb-10 text-center">
          Marketplace <span className="text-[#9878f3]">ReUse</span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.length > 0 ? (
            filteredListings.map((listing) => {
              const coverImage =
                listing.product_images.find((img) => img.is_cover)?.image_url ??
                "/placeholder.png";

              return (
                <div
                  key={listing.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  <img
                    src={coverImage}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-6 text-left">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {listing.title}
                    </h2>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {listing.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-[#9878f3] font-bold text-lg">
                        R$ {listing.price.toFixed(2)}
                      </span>

                      <Link
                        to={`/listing/${listing.id}`}
                        className="bg-[#9878f3] hover:bg-[#7b6ccb] text-white px-4 py-2 rounded-lg font-semibold transition"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              Nenhum anúncio disponível no momento.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
