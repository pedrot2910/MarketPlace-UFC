import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getListingById, updateListing } from "../services/listings";

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
  });

  useEffect(() => {
    if (!id) return;

    getListingById(id).then((product) => {
      setForm({
        title: product.title,
        description: product.description,
        price: product.price,
      });
    });
  }, [id]);

  async function handleSave() {
    if (!id) return;

    await updateListing(id, form);
    alert("Anúncio atualizado!");
    navigate("/profile");
  }

  return (
    <div>
      <input
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input
        type="number"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
      />

      <button onClick={handleSave}>Salvar</button>
    </div>
  );
}
