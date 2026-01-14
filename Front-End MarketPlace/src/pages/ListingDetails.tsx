import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AlertCircle, Check, X, ChevronLeft, ChevronRight, ZoomIn, User } from "lucide-react";
import { getListingById, deleteListing, fetchListings, type Product } from "../services/listings";
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

  profile_images?: {
    image_url: string;
  }[];
};

export default function ListingDetails() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [sellerListings, setSellerListings] = useState<Product[]>([]);
  const { user } = useAuth();
  const chatModal = useChatModal();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      try {
        const data = await getListingById(id);
        setListing(data);
        
        // Buscar outros anúncios do mesmo vendedor
        const allListings = await fetchListings();
        const otherListings = allListings.filter(
          (item) => item.profile_id === data.profile_id && item.id !== id
        ).slice(0, 4); // Limitar a 4 anúncios
        setSellerListings(otherListings);
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

  function nextImage() {
    if (!listing) return;
    setCurrentImageIndex((prev) => 
      prev === listing.product_images.length - 1 ? 0 : prev + 1
    );
  }

  function prevImage() {
    if (!listing) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? listing.product_images.length - 1 : prev - 1
    );
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

  const coverImage = listing.product_images[0]?.image_url; // Primeira imagem já é a capa após ordenação

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

      {/* Lightbox */}
      {showLightbox && listing && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setShowLightbox(false)}
        >
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
          >
            <X className="w-8 h-8" />
          </button>

          {listing.product_images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 text-white hover:text-gray-300 transition"
              >
                <ChevronLeft className="w-12 h-12" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 text-white hover:text-gray-300 transition"
              >
                <ChevronRight className="w-12 h-12" />
              </button>
            </>
          )}

          <img
            src={listing.product_images[currentImageIndex]?.image_url}
            alt={listing.title}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-4 text-white text-sm">
            {currentImageIndex + 1} / {listing.product_images.length}
          </div>
        </div>
      )}

      <div className="min-h-[calc(100vh-4rem)] bg-[var(--color-bg)] py-6 px-4">
        <div className="max-w-2xl mx-auto mt-10 bg-[var(--color-card)] p-6 rounded-2xl shadow-lg">
        {/* Carrossel de Imagens */}
        <div className="relative mb-4 group">
          <div 
            className="relative w-full h-64 rounded-xl overflow-hidden cursor-zoom-in"
            onClick={() => setShowLightbox(true)}
          >
            <img
              src={listing.product_images[currentImageIndex]?.image_url || coverImage}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            
            {/* Ícone de zoom */}
            <div className="absolute top-3 right-3 bg-black/50 rounded-full p-2 opacity-0 group-hover:opacity-100 transition">
              <ZoomIn className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Navegação do carrossel */}
          {listing.product_images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Indicadores */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {listing.product_images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition ${
                      index === currentImageIndex
                        ? 'bg-white w-6'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Miniaturas */}
        {listing.product_images.length > 1 && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {listing.product_images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                  index === currentImageIndex
                    ? 'border-[var(--color-primary)]'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img
                  src={img.image_url}
                  alt={`${listing.title} - ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

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

        {/* Botões de ação */}
        {user && listing.profile_id === user.id ? (
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => navigate(`/edit-listing/${listing.id}`)}
              className="flex-1 bg-[var(--color-secondary-dark)] hover:bg-[var(--color-secondary)] text-[var(--color-text-invert)] font-semibold py-3 rounded-xl shadow transition-all duration-200"
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
        ) : user ? (
          <button
            onClick={handleChat}
            className="w-full mt-6 bg-[var(--color-secondary-dark)] hover:bg-[var(--color-secondary)] text-[var(--color-text-invert)] font-semibold py-3 rounded-xl shadow transition-all duration-200"
          >
            Conversar com o vendedor
          </button>
        ) : null}

        {/* Seção do Vendedor */}
        <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Sobre o Anunciante</h3>
          
          <div className="flex items-center gap-4 p-4 bg-[var(--color-bg)] rounded-xl">
            {/* Avatar do vendedor */}
            <div className="flex-shrink-0 w-16 h-16 bg-[var(--color-primary)] rounded-full flex items-center justify-center overflow-hidden">
              {listing.profile_images?.[0]?.image_url ? (
                <img 
                  src={listing.profile_images[0].image_url} 
                  alt={listing.profiles?.name ?? "Vendedor"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            
            {/* Informações do vendedor */}
            <div className="flex-1">
              <p className="font-semibold text-[var(--color-text)] text-lg">
                {listing.profiles?.name ?? "Vendedor"}
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Matrícula: {listing.profiles?.matricula ?? "N/A"}
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                {listing.profiles?.email ?? ""}
              </p>
            </div>
          </div>

          {/* Outros anúncios do vendedor */}
          {sellerListings.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-semibold text-[var(--color-text)] mb-3">
                Outros anúncios deste vendedor ({sellerListings.length})
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                {sellerListings.map((item) => {
                  const coverImage = item.product_images[0]?.image_url;
                  
                  return (
                    <Link
                      key={item.id}
                      to={`/listing/${item.id}`}
                      className="group bg-white rounded-lg overflow-hidden border border-[var(--color-border)] hover:shadow-md transition-all"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      <div className="aspect-square overflow-hidden bg-gray-100">
                        <img
                          src={coverImage}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3">
                        <h5 className="text-sm font-semibold text-[var(--color-text)] line-clamp-2 mb-1">
                          {item.title}
                        </h5>
                        <p className="text-base font-bold" style={{ color: 'hsl(263, 70%, 50%)' }}>
                          R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </>
  );
}
