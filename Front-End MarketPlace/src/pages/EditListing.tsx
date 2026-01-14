import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getListingById, updateListing } from "../services/listings";
import { fetchCategories } from "../services/categories";
import type { Category } from "../services/categories";
import { uploadImage } from "../services/upload.service";

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [condition, setCondition] = useState<"novo" | "seminovo" | "usado">(
    "novo"
  );
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [type, setType] = useState<"venda" | "troca">("venda");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [existingImages, setExistingImages] = useState<
    { id?: string; image_url: string; is_cover: boolean }[]
  >([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!id) return;

      try {
        const [product, categoriesList] = await Promise.all([
          getListingById(id),
          fetchCategories(),
        ]);

        setTitle(product.title);
        setDescription(product.description || "");
        setPrice(product.price);
        setCondition(product.condition);
        setType(product.type);
        setCategory(product.category_id);
        setCategories(categoriesList);
        setExistingImages(product.product_images || []);
        const coverIdx =
          product.product_images?.findIndex((img: any) => img.is_cover) ?? 0;
        setCoverIndex(coverIndex >= 0 ? coverIdx : 0);
        const coverImg = product.product_images?.find(
          (img: any) => img.is_cover
        );
        setCoverImageUrl(
          coverImg
            ? coverImg.image_url
            : product.product_images?.[0]?.image_url || null
        );
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setErrorMessage("Erro ao carregar anúncio");
        setShowError(true);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!id) return;

    try {
      setSaving(true);

      // Upload apenas de novas imagens (se houver)
      let newImageUrls: string[] = [];
      if (newImages.length > 0) {
        newImageUrls = await Promise.all(
          newImages.map((img) => uploadImage(img))
        );
      }

      const updateData = {
        title,
        description: description || undefined,
        price: Number(price),
        type,
        condition,
        category_id: category,
        // Envia apenas as novas imagens para serem adicionadas
        product_images: newImageUrls.length > 0 ? newImageUrls : undefined,
        // Envia as URLs das imagens a serem removidas
        images_to_remove: removedImages.length > 0 ? removedImages : undefined,
        // Envia qual imagem deve ser a capa
        cover_image_url: coverImageUrl,
      };

      console.log("📤 Enviando para backend:", updateData);

      await updateListing(id, updateData);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate(`/listing/${id}`);
      }, 2000);
    } catch (error: any) {
      console.error("Erro ao atualizar anúncio:", error);
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Erro ao atualizar anúncio"
      );
      setShowError(true);
      setTimeout(() => setShowError(false), 4000);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-[var(--color-text)]">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--color-bg)] py-12 px-6 flex justify-center items-center">
      {/* Notificação de Sucesso */}
      {showSuccess && (
        <div className="fixed top-20 right-6 z-50 animate-fade-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-md">
            <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-green-500 text-xl font-bold">✓</span>
            </div>
            <div>
              <p className="font-semibold">Sucesso!</p>
              <p className="text-sm">Anúncio atualizado com sucesso!</p>
            </div>
          </div>
        </div>
      )}

      {/* Notificação de Erro */}
      {showError && (
        <div className="fixed top-20 right-6 z-50 animate-fade-in">
          <div className="bg-red-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-md">
            <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-red-500 text-xl font-bold">✕</span>
            </div>
            <div>
              <p className="font-semibold">Erro!</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl bg-[var(--color-card)] rounded-2xl shadow-lg p-10">
        <h2 className="text-3xl font-bold text-[var(--color-text)] text-center mb-6">
          Editar Anúncio
        </h2>

        <p className="text-[var(--color-text-muted)] text-center mb-8">
          Atualize as informações do seu anúncio no{" "}
          <span className="text-[var(--color-primary)] font-semibold">
            Marketplace
          </span>
          .
        </p>

        <form onSubmit={handleSubmit} className="grid gap-5">
          {/* Seção de Imagens */}
          <div>
            <label className="block text-[var(--color-text)] font-semibold mb-2">
              Imagens do Produto{" "}
              {existingImages.length + newImages.length > 0 &&
                `(${existingImages.length + newImages.length})`}
            </label>

            {/* Imagens Existentes */}
            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-[var(--color-text-muted)] mb-2">
                  Imagens atuais:
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {existingImages.map((img, index) => (
                    <div
                      key={index}
                      className="relative group aspect-square rounded-lg overflow-hidden border-2 hover:border-[#9878f3] transition"
                      style={{
                        borderColor:
                          img.image_url === coverImageUrl
                            ? "#9878f3"
                            : "transparent",
                      }}
                    >
                      <img
                        src={img.image_url}
                        alt={`Imagem ${index + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {img.image_url === coverImageUrl && (
                        <div className="absolute top-2 left-2 bg-[#9878f3] text-white text-xs font-semibold px-2 py-1 rounded">
                          CAPA
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        {img.image_url !== coverImageUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              console.log(
                                "🖼️ Definindo nova capa:",
                                img.image_url
                              );
                              setCoverImageUrl(img.image_url);
                              setCoverIndex(index);
                            }}
                            className="btn-secondary text-xs px-2 py-1"
                          >
                            Definir Capa
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            console.log("🗑️ Removendo imagem:", img.image_url);
                            // Adicionar à lista de removidas
                            setRemovedImages((prev) => {
                              const updated = [...prev, img.image_url];
                              console.log("Lista de removidas:", updated);
                              return updated;
                            });
                            setExistingImages((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                            // Se for a capa, definir a próxima como capa
                            if (img.image_url === coverImageUrl) {
                              const remaining = existingImages.filter(
                                (_, i) => i !== index
                              );
                              const newCover = remaining[0]?.image_url || null;
                              console.log("Nova capa após remoção:", newCover);
                              setCoverImageUrl(newCover);
                              setCoverIndex(0);
                            }
                          }}
                          className="btn-critical text-xs px-2 py-1"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Adicionar Novas Imagens */}
            <label
              htmlFor="file-upload-edit"
              className="flex flex-col items-center justify-center gap-2 cursor-pointer
               border-2 border-dashed border-gray-300 rounded-xl p-6
               hover:border-[#9878f3] transition text-center"
            >
              <span className="text-sm text-gray-500">
                Clique para adicionar mais imagens
              </span>
              <span className="text-xs text-gray-400">
                PNG, JPG, WEBP até 5MB (múltiplas imagens)
              </span>
            </label>

            <input
              id="file-upload-edit"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (files.length === 0) return;

                setNewImages((prev) => [...prev, ...files]);

                files.forEach((file) => {
                  const url = URL.createObjectURL(file);
                  setNewPreviews((prev) => [...prev, url]);
                });
              }}
            />

            {/* Preview de Novas Imagens */}
            {newPreviews.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-[var(--color-text-muted)] mb-2">
                  Novas imagens a adicionar:
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {newPreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative group aspect-square rounded-lg overflow-hidden border-2 border-green-500/50"
                    >
                      <img
                        src={preview}
                        alt={`Nova imagem ${index + 1}`}
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        NOVA
                      </div>

                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setNewImages((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                            setNewPreviews((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                          }}
                          className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[var(--color-text)] font-semibold mb-1">
              Título
            </label>
            <input
              className="w-full border text-[var(--color-text)] border-[var(--color-border)] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
              placeholder="Ex: Calculadora científica Casio"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[var(--color-text)] font-semibold mb-1">
              Descrição
            </label>
            <textarea
              className="w-full border text-[var(--color-text)] border-[var(--color-border)] rounded-lg px-4 py-2 h-32 resize-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
              placeholder="Descreva o produto, estado de uso, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[var(--color-text)] font-semibold mb-1">
                Preço (R$)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full border text-[var(--color-text)] border-[var(--color-border)] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
                placeholder="Ex: 45.00"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value ? Number(e.target.value) : "")
                }
                required
              />
            </div>

            <div>
              <label className="block text-[var(--color-text)] font-semibold mb-1">
                Tipo de Anúncio
              </label>
              <select
                className="w-full border text-[var(--color-text)] border-[var(--color-border)] rounded-lg px-4 py-2 bg-[var(--color-card)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
                value={type}
                onChange={(e) => setType(e.target.value as "venda" | "troca")}
              >
                <option value="venda">Venda</option>
                <option value="troca">Troca</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[var(--color-text)] font-semibold mb-1">
              Condição
            </label>
            <select
              className="w-full border text-[var(--color-text)] border-[var(--color-border)] rounded-lg px-4 py-2 bg-[var(--color-card)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
              value={condition}
              onChange={(e) =>
                setCondition(e.target.value as "novo" | "seminovo" | "usado")
              }
            >
              <option value="novo">Novo</option>
              <option value="seminovo">Seminovo</option>
              <option value="usado">Usado</option>
            </select>
          </div>

          <div>
            <label className="block text-[var(--color-text)] font-semibold mb-1">
              Categoria
            </label>
            <select
              className="w-full border text-[var(--color-text)] border-[var(--color-border)] rounded-lg px-4 py-2 bg-[var(--color-card)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.namecategories}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(`/listing/${id}`)}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white text-lg font-semibold py-3 rounded-xl transition-all duration-200 shadow-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`flex-1 text-white text-lg font-semibold py-3 rounded-xl transition-all duration-200 shadow-md ${
                saving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[var(--color-secondary-dark)] hover:bg-[var(--color-secondary)]"
              }`}
            >
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
