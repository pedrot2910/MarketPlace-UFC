import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] bg-[#EAEFFE]">
      <div className="w-full md:max-w-6xl bg-white mx-auto p-16 rounded-2xl shadow-lg text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-3">
          Bem-vindo ao <span className="text-[#9878f3]">ReUse</span>
        </h1>
        <h2 className="text-lg font-semibold text-gray-400 mb-6">
          O marketplace acadêmico mais completo!
        </h2>
        <p className="text-gray-700 text-lg max-w-3xl mx-auto leading-relaxed">
          Compre, venda ou troque materiais acadêmicos entre alunos, professores
          e funcionários da universidade. Promova economia circular e colabore
          com sua comunidade!
        </p>
        <div className="mt-10">
          <Link
            to="/marketplace"
            className="inline-block bg-[#9878f3] hover:bg-[#7b6ccb] text-white text-lg font-semibold px-8 py-4 rounded-xl transition-all shadow-md"
          >
            <span className="text-white">Acessar Marketplace</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
