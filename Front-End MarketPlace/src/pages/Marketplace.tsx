import { useEffect, useState } from "react";
import type { Listing } from "../types/listing";
import { fetchListings } from "../services/listings";

export default function Marketplace() {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    fetchListings().then(setListings);
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#EAEFFE] py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Título */}
        <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center">
          🛍️ Marketplace Acadêmico
        </h1>

        {/* Grade de Anúncios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.length > 0 ? (
            listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Imagem do produto */}
                {listing.imageUrl && (
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />
                )}

                {/* Conteúdo */}
                <div className="p-6 text-left">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {listing.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {listing.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-[#9878f3] font-bold text-lg">
                      R${" "}
                      {listing.price !== undefined
                        ? listing.price.toFixed(2)
                        : "N/A"}
                    </span>

                    <button className="bg-[#9878f3] hover:bg-[#7b6ccb] text-white px-4 py-2 rounded-lg font-semibold transition">
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              Nenhum anúncio disponível no momento 😔
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
