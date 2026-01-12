import { useEffect, useState } from "react";
import type { Listing } from "../types/listing";
import { fetchListings } from "../services/listings";
import { useAuth } from "../hooks/auth";

export default function Profile() {
  const { user } = useAuth(); // <-- PEGA O USUÁRIO LOGADO
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        if (!user) return; // se não tiver user, não busca nada

        setLoading(true);

        const allListings = await fetchListings();
        const userListings = allListings.filter(
          (l) => l.ownerName === user.name
        );

        setListings(userListings);
      } catch (err) {
        console.error("Erro ao carregar o perfil:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  if (!user) {
    return (
      <p className="text-center text-[var(--color-error)] mt-10">
        Você precisa estar logado para ver seu perfil.
      </p>
    );
  }

  if (loading)
    return (
      <p className="text-center text-[var(--color-text-muted)] mt-10 animate-pulse">
        Carregando perfil...
      </p>
    );

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-[var(--color-bg)] px-4">
      <div className="bg-[var(--color-card)] rounded-2xl shadow-lg p-10 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-6 text-center">
          Meu Perfil
        </h1>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div>
            <p className="font-semibold text-[var(--color-text)]">Nome:</p>
            <p className="text-lg text-[var(--color-text)]">{user.name}</p>
          </div>
          <div>
            <p className="font-semibold text-[var(--color-text)]">Email:</p>
            <p className="text-lg text-[var(--color-text)]">{user.email}</p>
          </div>
          <div>
            <p className="font-semibold text-[var(--color-text)]">Função:</p>
            <p className="text-lg text-[var(--color-text)] capitalize">{user.role}</p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4 border-b pb-2">
            Seus anúncios
          </h2>

          {listings.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {listings.map((item) => (
                <li
                  key={item.id}
                  className="border border-[var(--color-border)] rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all bg-[var(--color-bg-alt)]"
                  onClick={() => (window.location.href = `/listing/${item.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <h3 className="font-bold text-[var(--color-text)] text-lg">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-sm text-[var(--color-text)] mt-3">
                    <span className="font-semibold">Preço:</span> R${" "}
                    {item.price}
                  </p>
                  <span
                    className={`inline-block mt-3 px-3 py-1 text-xs font-semibold rounded-full ${
                      item.type === "offer"
                        ? "bg-[var(--color-secondary-light)] text-[var(--color-secondary-dark)]"
                        : "bg-[var(--color-secondary)] text-[var(--color-text-invert)]"
                    } uppercase`}
                  >
                    {item.type}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[var(--color-text-muted)] text-center mt-4">
              Você ainda não possui anúncios.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
