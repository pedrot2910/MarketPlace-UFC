import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Simulação de login
    navigate("/");
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-[#EAEFFE] px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Bem-vindo de volta!
        </h2>
        <p className="text-gray-600 mb-8">
          Acesse sua conta com seu e-mail institucional
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email institucional
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="exemplo@alu.ufc.br"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600">
          Ainda não tem uma conta?{" "}
          <a href="#" className="text-indigo-600 hover:underline font-medium">
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  );
}
