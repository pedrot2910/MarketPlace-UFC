import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AlertCircle, Check, X } from "lucide-react";
import { getListingById, deleteListing } from "../services/listings";
import { useAuth } from "../hooks/auth/useAuth";
import { useChatModal } from "../hooks/useChatModal";
import type { Profile } from "../types/profile";

type ProductDetails = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  type: "venda" | "troca";
  condition: "novo" | "seminovo" | "usado";
  profile_id: string;

  profiles: Profile;

  categories: {
    namecategories: string;
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const { user } = useAuth();
  const chatModal = useChatModal();
  const navigate = useNavigate();

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

  async function handleDelete() {
    setShowDeleteModal(true);
  }

  async function confirmDelete() {
    if (!id || !listing) return;

    setShowDeleteModal(false);
    try {
      await deleteListing(id);
      setShowSuccessModal(true);
      setTimeout(() => {
        navigate("/marketplace");
      }, 2000);
    } catch (error) {
      console.error("Erro ao deletar anúncio:", error);
      setShowErrorModal(true);
    }
  }

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
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[var(--color-primary)] mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-[var(--color-text)]">
            Carregando anúncio...
          </p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-center bg-[var(--color-card)] p-8 rounded-2xl shadow-lg">
          <p className="text-xl font-semibold text-[var(--color-text)] mb-2">
            Anúncio não encontrado
          </p>
          <p className="text-[var(--color-text-muted)]">
            O anúncio que você procura não existe ou foi removido.
          </p>
        </div>
      </div>
    );
  }

  const coverImage = listing.product_images.find(
    (img) => img.is_cover
  )?.image_url;

  return (
    <>
      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/10 flex items-center justify-center z-50 px-4">
          <div className="bg-[var(--color-card)] rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-16 h-16 text-[var(--color-error)]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text)] text-center mb-2">
              Deletar Anúncio?
            </h3>
            <p className="text-[var(--color-text-muted)] text-center mb-6">
              Tem certeza que deseja deletar este anúncio? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-[var(--color-border)] hover:bg-[var(--color-text-muted)] text-[var(--color-text)] font-semibold py-3 rounded-xl transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-[var(--color-error)] hover:bg-[var(--color-warning)] text-[var(--color-text-invert)] font-semibold py-3 rounded-xl transition-all duration-200"
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Sucesso */}
      {showSuccessModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/10 flex items-center justify-center z-50 px-4">
          <div className="bg-[var(--color-card)] rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-center mx-auto mb-4">
              <Check className="w-16 h-16 text-[var(--color-success)]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text)] text-center mb-2">
              Sucesso!
            </h3>
            <p className="text-[var(--color-text-muted)] text-center">
              Anúncio deletado com sucesso! Redirecionando...
            </p>
          </div>
        </div>
      )}

      {/* Modal de Erro */}
      {showErrorModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/10 flex items-center justify-center z-50 px-4">
          <div className="bg-[var(--color-card)] rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-center mx-auto mb-4">
              <X className="w-16 h-16 text-[var(--color-error)]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text)] text-center mb-2">
              Erro!
            </h3>
            <p className="text-[var(--color-text-muted)] text-center mb-6">
              Não foi possível deletar o anúncio. Tente novamente.
            </p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="w-full bg-[var(--color-error)] hover:bg-[var(--color-warning)] text-[var(--color-text-invert)] font-semibold py-3 rounded-xl transition-all duration-200"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

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
          R$ {listing.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>

        <p className="text-sm text-[var(--color-text-muted)]">
          <span className="font-medium">Anunciante:</span>{" "}
          {listing.profiles?.name ?? "Desconhecido"}
        </p>

        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          <span className="font-medium">Categoria:</span>{" "}
          {listing.categories?.namecategories ?? "Sem categoria"}
        </p>

        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          <span className="font-medium">Condição:</span>{" "}
          <span className="capitalize">{listing.condition}</span>
        </p>

        <div className="flex gap-2 mt-4">
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

        {user && listing.profile_id === user.id ? (
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => navigate(`/edit-listing/${listing.id}`)}
              className="flex-1 bg-[var(--color-info)] hover:bg-[var(--color-primary-light)] text-[var(--color-text-invert)] font-semibold py-3 rounded-xl shadow transition-all duration-200"
            >
              Editar Anúncio
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 bg-[var(--color-error)] hover:bg-[var(--color-warning)] text-[var(--color-text-invert)] font-semibold py-3 rounded-xl shadow transition-all duration-200"
            >
              Deletar Anúncio
            </button>
          </div>
        ) : (
          <button
            onClick={handleChat}
            className="w-full mt-4 bg-[var(--color-secondary-dark)] hover:bg-[var(--color-secondary)] text-[var(--color-text-invert)] font-semibold py-3 rounded-xl shadow transition-all duration-200"
          >
            Conversar com o vendedor
          </button>
        )}
        </div>
      </div>
    </>
  );
}
