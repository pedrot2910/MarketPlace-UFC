import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] bg-[var(--color-bg)]">
      <div className="w-full md:max-w-6xl bg-[var(--color-card)] mx-auto p-16 rounded-2xl shadow-lg text-center">
        <h1 className="text-5xl font-bold text-[var(--color-text)] mb-3">
          Bem-vindo ao <span className="text-[var(--color-primary)]">ReUse</span>
        </h1>
        <h2 className="text-lg font-semibold text-[var(--color-text-muted)] mb-6">
          O marketplace acadêmico mais completo!
        </h2>
        <p className="text-[var(--color-text)] text-lg max-w-3xl mx-auto leading-relaxed">
          Compre, venda ou troque materiais acadêmicos entre alunos, professores
          e funcionários da universidade. Promova economia circular e colabore
          com sua comunidade!
        </p>
        <div className="mt-10">
          <Link
            to="/marketplace"
            className="inline-block bg-[var(--color-secondary-dark)] hover:bg-[var(--color-secondary)] text-[var(--color-text-invert)] text-lg font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-md"
          >
            <span className="text-[var(--color-text-invert)]">Acessar Marketplace</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
