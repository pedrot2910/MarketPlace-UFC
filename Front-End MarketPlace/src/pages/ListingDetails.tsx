import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getListingById } from "../services/listings";
import { useAuth } from "../hooks/auth/useAuth";
import { useChatModal } from "../hooks/useChatModal";
import type { Profile } from "../types/profile";

type ProductDetails = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  type: "venda" | "troca";

  profiles: Profile;

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
    console.log("🧪 LISTING PROFILES:", listing?.profiles);

    if (!user) {
      alert("Você precisa estar logado");
      return;
    }

    if (!listing) return;

    if (user.id === listing.profiles.id) {
      alert("Você não pode conversar com você mesmo.");
      return;
    }

    chatModal.openChat({
      receiverId: listing.profiles.id,
      productId: listing.id,
    });
  }

  if (loading) {
    return <div className="text-center mt-20">Carregando anúncio...</div>;
  }

  if (!listing) {
    return <div className="text-center mt-20">Anúncio não encontrado.</div>;
  }

  const coverImage = listing.product_images.find(
    (img) => img.is_cover
  )?.image_url;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--color-bg)] py-6 px-4">
      <div className="max-w-2xl mx-auto mt-10 bg-[var(--color-card)] p-6 rounded-2xl shadow-lg">
        <img
          src={coverImage}
          alt={listing.title}
          className="w-full h-64 object-cover rounded-xl mb-4"
        />

        <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-2">
          {listing.title}
        </h1>

        <p className="text-[var(--color-text-muted)] mb-3">
          {listing.description}
        </p>

        <p className="text-lg font-semibold text-[var(--color-primary-light)] mb-2">
          R$ {listing.price}
        </p>

        <p className="text-sm text-[var(--color-text-muted)]">
          <span className="font-medium">Anunciante:</span>{" "}
          {listing.profiles?.name ?? "Desconhecido"}
        </p>

        <span
          className={`text-xs font-semibold rounded-full inline-block px-3 py-1 mt-4 ${
            listing.type === "venda"
              ? "bg-[var(--color-secondary-light)] text-[var(--color-secondary-dark)]"
              : "bg-[var(--color-secondary)] text-[var(--color-text-invert)]"
          } uppercase`}
        >
          {listing.type === "venda" ? "Venda" : "Troca"}
        </span>

        <button
          onClick={handleChat}
          className="w-full mt-4 bg-[var(--color-secondary-dark)] hover:bg-[var(--color-secondary)] text-[var(--color-text-invert)] font-semibold py-3 rounded-xl shadow transition-all duration-200"
        >
          Conversar com o vendedor
        </button>
      </div>
    </div>
  );
}
