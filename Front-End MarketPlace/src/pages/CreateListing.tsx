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
  const [image, setImage] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

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

    setUploading(true);

    const imageUrl = await uploadImage(image![0]);

    await createListing({
      title,
      description,
      price: Number(price),
      type,
      condition,
      category_id: category,
      product_images: [imageUrl],
    });

    setUploading(false);

    alert("Anúncio criado com sucesso!");

    setPreview(null);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--color-bg)] py-12 px-6 flex justify-center items-center">
      <div className="w-full max-w-3xl bg-[var(--color-card)] rounded-2xl shadow-lg p-10">
        <h2 className="text-3xl font-bold text-[var(--color-text)] text-center mb-6">
          Criar Novo Anúncio
        </h2>

        <p className="text-[var(--color-text-muted)] text-center mb-8">
          Preencha as informações abaixo para publicar seu anúncio no{" "}
          <span className="text-[var(--color-primary)] font-semibold">Marketplace</span>.
        </p>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <div>
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                Imagem do Produto
              </label>

              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center gap-2 cursor-pointer
               border-2 border-dashed border-gray-300 rounded-xl p-6
               hover:border-[#9878f3] transition text-center"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-40 object-contain rounded-lg"
                  />
                ) : (
                  <>
                    <span className="text-sm text-gray-500">
                      Clique para selecionar uma imagem
                    </span>
                    <span className="text-xs text-gray-400">
                      PNG, JPG, WEBP até 5MB
                    </span>
                  </>
                )}
              </label>

              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  setImage([file]);
                  setPreview(URL.createObjectURL(file));
                }}
              />
            </div>

            <label className="block text-gray-800 font-semibold mb-1">
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

          <select onChange={(e) => setCondition(e.target.value as any)}>
            <option value="novo">Novo</option>
            <option value="seminovo">Seminovo</option>
            <option value="usado">Usado</option>
          </select>

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
            className="w-full bg-[var(--color-secondary-dark)] hover:bg-[var(--color-secondary)] text-[var(--color-text-invert)] text-lg font-semibold py-3 rounded-xl transition-all duration-200 shadow-md"
          >
            Publicar Anúncio
          </button>
        </form>
      </div>
    </div>
  );
}
