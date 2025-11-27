import { createListing } from "../services/listings";
import { useState } from "react";

export default function CreateListing() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [type, setType] = useState<"offer" | "trade">("offer");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createListing({ title, description, price: Number(price), type });
    alert("Anúncio criado com sucesso!");
    setTitle("");
    setDescription("");
    setPrice("");
    setType("offer");
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#EAEFFE] py-12 px-6 flex justify-center items-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-10">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Criar Novo Anúncio
        </h2>

        <p className="text-gray-600 text-center mb-8">
          Preencha as informações abaixo para publicar seu anúncio no{" "}
          <span className="text-[#9878f3] font-semibold">Marketplace</span>.
        </p>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <div>
            <label className="block text-gray-800 font-semibold mb-1">
              Título
            </label>
            <input
              className="w-full border text-gray-800 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#9878f3] focus:outline-none"
              placeholder="Ex: Calculadora científica Casio"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-800 font-semibold mb-1">
              Descrição
            </label>
            <textarea
              className="w-full border text-gray-800 border-gray-300 rounded-lg px-4 py-2 h-32 resize-none focus:ring-2 focus:ring-[#9878f3] focus:outline-none"
              placeholder="Descreva o produto, estado de uso, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-800 font-semibold mb-1">
                Preço (R$)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full border text-gray-800 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#9878f3] focus:outline-none"
                placeholder="Ex: 45.00"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value ? Number(e.target.value) : "")
                }
                required
              />
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-1">
                Tipo de Anúncio
              </label>
              <select
                className="w-full border text-gray-800 border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-[#9878f3] focus:outline-none"
                value={type}
                onChange={(e) => setType(e.target.value as "offer" | "trade")}
              >
                <option value="offer">Oferta (Venda)</option>
                <option value="trade">Troca</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#9878f3] hover:bg-[#7b6ccb] text-white text-lg font-semibold py-3 rounded-xl transition-all shadow-md"
          >
            Publicar Anúncio
          </button>
        </form>
      </div>
    </div>
  );
}
