import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getListingById } from "../services/listings";
import { useAuth } from "../hooks/auth/useAuth";
import { useChatModal } from "../hooks/useChatModal";

type ProductDetails = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  type: "venda" | "troca";

  profiles: {
    name: string;
  };

  product_images: {
    image_url: string;
    is_cover: boolean;
  }[];
};

export default function ListingDetails() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const chatModal = useChatModal();

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      try {
        const data = await getListingById(id);
        setListing(data);
      } catch (error) {
        console.error("Erro ao carregar anúncio:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  function handleChat() {
    if (!user) {
      alert("Você precisa estar logado");
      return;
    }

    if (!listing) return;

    chatModal.openWithThread({
      buyerId: Number(user.id),
      sellerId: 0, // ⚠️ Ajustaremos depois quando existir profile_id no retorno
      productId: Number(listing.id),
    });
  }

  if (loading) {
    return <div className="text-center mt-20">Carregando anúncio...</div>;
  }

  if (!listing) {
    return <div className="text-center mt-20">Anúncio não encontrado.</div>;
  }

  const coverImage =
    listing.product_images.find((img) => img.is_cover)?.image_url ??
    "/placeholder.png";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#EAEFFE] py-6 px-4">
      <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg">
        <img
          src={coverImage}
          alt={listing.title}
          className="w-full h-64 object-cover rounded-xl mb-4"
        />

        <h1 className="text-3xl font-bold text-[#9878f3] mb-2">
          {listing.title}
        </h1>

        <p className="text-gray-600 mb-3">{listing.description}</p>

        <p className="text-lg font-semibold text-[#7b6ccb] mb-2">
          R$ {listing.price}
        </p>

        <p className="text-sm text-gray-500">
          <span className="font-medium">Anunciante:</span>{" "}
          {listing.profiles?.name ?? "Desconhecido"}
        </p>

        <span
          className={`text-xs font-semibold rounded-full inline-block px-3 py-1 mt-4 ${
            listing.type === "venda"
              ? "bg-purple-50 text-[#9878f3]"
              : "bg-[#b6acf3] text-white"
          } uppercase`}
        >
          {listing.type === "venda" ? "Venda" : "Troca"}
        </span>

        <button
          onClick={handleChat}
          className="w-full mt-4 bg-[#9878f3] text-white font-semibold py-3 rounded-xl shadow"
        >
          Conversar com o vendedor
        </button>
      </div>
    </div>
  );
}
