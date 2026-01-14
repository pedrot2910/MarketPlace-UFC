import { createListing } from "../services/listings";
import { useState, useEffect } from "react";
import { fetchCategories } from "../services/categories";
import type { Category } from "../services/categories";
import { uploadImage } from "../services/upload.service";
export default function CreateListing() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [condition, setCondition] = useState<"novo" | "seminovo" | "usado">(
    "novo"
  );
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [type, setType] = useState<"venda" | "troca">("venda");
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error("Erro ao carregar categorias", err);
      }
    }

    loadCategories();
  }, []);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validações antes de enviar
    if (!images || images.length === 0) {
      setErrorMessage("Por favor, selecione pelo menos uma imagem para o produto");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    if (!category) {
      setErrorMessage("Por favor, selecione uma categoria");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    try {
      setUploading(true);

      // Upload de todas as imagens
      const imageUrls = await Promise.all(
        images.map((img) => uploadImage(img))
      );

      // Marcar qual é a imagem de capa
      const imagesWithCover = imageUrls.map((url, index) => ({
        url,
        is_cover: index === coverIndex,
      }));

      await createListing({
        title,
        description: description || undefined,
        price: Number(price),
        type,
        condition,
        category_id: category,
        product_images: imagesWithCover.map((img) => img.url),
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);

      // Limpar o formulário
      setTitle("");
      setDescription("");
      setPrice("");
      setCondition("novo");
      setCategory("");
      setType("venda");
      setImages([]);
      setPreviews([]);
      setCoverIndex(0);
    } catch (error: any) {
      console.error("Erro ao criar anúncio:", error);
      setErrorMessage(
        error.response?.data?.message || error.message || "Erro desconhecido ao criar anúncio"
      );
      setShowError(true);
      setTimeout(() => setShowError(false), 4000);
    } finally {
      setUploading(false);
    }
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
              <p className="text-sm">Anúncio criado com sucesso!</p>
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
          Criar Novo Anúncio
        </h2>

        <p className="text-[var(--color-text-muted)] text-center mb-8">
          Preencha as informações abaixo para publicar seu anúncio no{" "}
          <span className="text-[var(--color-primary)] font-semibold">
            Marketplace
          </span>
          .
        </p>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <div>
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                Imagens do Produto {previews.length > 0 && `(${previews.length})`}
              </label>

              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center gap-2 cursor-pointer
               border-2 border-dashed border-gray-300 rounded-xl p-6
               hover:border-[#9878f3] transition text-center"
              >
                <span className="text-sm text-gray-500">
                  Clique para adicionar imagens
                </span>
                <span className="text-xs text-gray-400">
                  PNG, JPG, WEBP até 5MB (múltiplas imagens)
                </span>
              </label>

              <input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length === 0) return;

                  setImages((prev) => [...prev, ...files]);
                  
                  files.forEach((file) => {
                    const url = URL.createObjectURL(file);
                    setPreviews((prev) => [...prev, url]);
                  });
                }}
              />

              {/* Preview das imagens */}
              {previews.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {previews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative group aspect-square rounded-lg overflow-hidden border-2 hover:border-[#9878f3] transition"
                      style={{
                        borderColor: index === coverIndex ? '#9878f3' : 'transparent'
                      }}
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Badge de capa */}
                      {index === coverIndex && (
                        <div className="absolute top-2 left-2 bg-[#9878f3] text-white text-xs font-semibold px-2 py-1 rounded">
                          CAPA
                        </div>
                      )}

                      {/* Botões de ação */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCoverIndex(index)}
                          className="bg-white text-gray-800 text-xs px-2 py-1 rounded hover:bg-gray-100"
                        >
                          Definir Capa
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setImages((prev) => prev.filter((_, i) => i !== index));
                            setPreviews((prev) => prev.filter((_, i) => i !== index));
                            if (coverIndex === index) setCoverIndex(0);
                            if (coverIndex > index) setCoverIndex((prev) => prev - 1);
                          }}
                          className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

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
              onChange={(e) => setCondition(e.target.value as "novo" | "seminovo" | "usado")}
            >
              <option value="novo">Novo</option>
              <option value="seminovo">Seminovo</option>
              <option value="usado">Usado</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-800 font-semibold mb-1">
              Categoria
            </label>

            <select
              className="w-full border text-gray-800 border-gray-300 rounded-lg px-4 py-2"
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

          <button
            type="submit"
            disabled={uploading}
            className={`w-full text-[var(--color-text-invert)] text-lg font-semibold py-3 rounded-xl transition-all duration-200 shadow-md ${
              uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[var(--color-secondary-dark)] hover:bg-[var(--color-secondary)]"
            }`}
          >
            {uploading ? "Criando anúncio..." : "Publicar Anúncio"}
          </button>
        </form>
      </div>
    </div>
  );
}
