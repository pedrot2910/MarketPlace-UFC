import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  ShoppingBag,
  Store,
  ArrowRightLeft,
  BadgeDollarSign,
  NotebookText,
  TabletSmartphone,
  ScrollText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import UserLocationMapOSM from "./UserLocationMapOSM";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState<string>("Definir localização");
  const [addressArray, setAddressArray] = useState<string[]>([]);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const navigate = useNavigate();

  const handleLocationSelect = (addr: string[]) => {
    setAddressArray(addr);
  };

  const handleConfirmLocation = () => {
    setLocation(addressArray.join(""));
    setShowMap(false);
  };

  return (
    <>
      {/* Botão do menu */}
      <button
        onClick={toggleSidebar}
        className="top-4 left-4 z-60 p-2 text-[#eaeffe] rounded-lg hover:bg-[#7b6ccb] hover:text-[#EAEFFE] transition"
      >
        {isOpen === false && <Menu size={24} />}
      </button>

      {showMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8 animate-fadeIn">
            {/* Botão de fechar */}
            <button
              onClick={() => setShowMap(false)}
              className="absolute right-8 top-6 text-gray-400 hover:text-gray-600 transition"
              aria-label="Fechar"
            >
              ✕
            </button>

            {/* Título */}
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
              Essa é a sua localização
            </h2>

            {/* Conteúdo */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-md bg-gray-50">
              <UserLocationMapOSM onLocationSelect={handleLocationSelect} />
            </div>

            {/* Rodapé */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Sua localização será usada para exibir produtos próximos a você.
              </p>
              <div className="mt-5 flex justify-center gap-4">
                <button
                  onClick={() => {
                    setShowMap(false);
                  }}
                  className="px-6 py-2 rounded-xl font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmLocation}
                  className="px-6 py-2 rounded-xl font-semibold bg-[#9878f3] text-white hover:bg-[#7b6ccb] shadow-md transition"
                >
                  Confirmar localização
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animação com Framer Motion */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Sidebar com transição */}
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
              className="fixed top-0 left-0 h-full w-72 bg-[#9878f3] text-white shadow-2xl z-60 flex flex-col overflow-y-auto scrollbar-custom"
            >
              {/* Cabeçalho com logo e nome */}
              <div className="flex items-center gap-3 mb-6 mt-12 px-8 py-3 bg-gradient-to-r from-[#7b6ccb] to-[#9878f3] rounded-r-3xl shadow-inner">
                <motion.img
                  src="/LogoReUse.png"
                  alt="Logo ReUse"
                  className="w-12 h-12 object-contain drop-shadow-lg"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                />
                <motion.h2
                  className="text-3xl font-bold text-[#EAEFFE] drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]"
                  style={{
                    WebkitTextStroke: "1px rgba(124,108,203,0.9)",
                    textShadow: "0 0 8px rgba(124,108,203,0.9)",
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link to="/home" onClick={() => setIsOpen(false)}>
                    ReUse
                  </Link>
                </motion.h2>
              </div>

              {/* Navegação */}
              <nav className="flex flex-col space-y-3 px-4">
                <div className="relative w-full max-w-sm">
                  <Search
                    size={20}
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="w-full pl-10 pr-4 py-2 bg-[#7b6ccb] rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EAEFFE]"
                  />
                </div>

                <Link
                  to="/marketplace"
                  className="flex items-center hover:text-[#EAEFFE] hover:bg-[#7b6ccb] p-2 pl-4 rounded-lg transition text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="p-2 rounded-full bg-[#7b6ccb] inline-grid mr-2">
                    <Store size={18} className="text-[#EAEFFE]" />
                  </div>
                  <span className="pl-2">Explorar</span>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center hover:text-[#EAEFFE] hover:bg-[#7b6ccb] p-2 pl-4 rounded-lg transition text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="p-2 rounded-full bg-[#7b6ccb] inline-grid mr-2">
                    <ShoppingBag size={18} className="text-[#EAEFFE]" />
                  </div>
                  <span className="pl-2">Compras</span>
                </Link>

                <button
                  className="hover:text-[#EAEFFE] hover:bg-[#7b6ccb] flex items-center p-2 pl-4 rounded-lg transition text-lg"
                  onClick={() => {
                    navigate("marketplace?mode=trade");
                    setIsOpen(false);
                  }}
                >
                  <div className="p-2 rounded-full bg-[#7b6ccb] inline-grid mr-2">
                    <ArrowRightLeft size={18} className="text-[#EAEFFE]" />
                  </div>
                  <span className="pl-2">Trocas</span>
                </button>

                <button
                  className="hover:text-[#EAEFFE] hover:bg-[#7b6ccb] flex items-center p-2 pl-4 rounded-lg transition text-lg"
                  onClick={() => {
                    navigate("marketplace?mode=offer");
                    setIsOpen(false);
                  }}
                >
                  <div className="p-2 rounded-full bg-[#7b6ccb] inline-grid mr-2">
                    <BadgeDollarSign size={18} className="text-[#EAEFFE]" />
                  </div>
                  <span className="pl-2">Vendas</span>
                </button>

                <hr className="border-t border-[#EAEFFE]" />

                <h1 className="font-semibold text-xl"> Localização </h1>

                <button
                  className="hover:text-[#EAEFFE] hover:bg-[#7b6ccb] flex items-center p-2 pl-4 rounded-lg transition text-lg text-left"
                  onClick={() => setShowMap(true)}
                >
                  <span
                    className={
                      location === "Definir localização"
                        ? "underline"
                        : "font-medium"
                    }
                  >
                    {" "}
                    {location}{" "}
                  </span>
                </button>

                <hr className="border-t border-[#EAEFFE]" />

                <h1 className="font-semibold text-xl"> Categorias </h1>

                <Link
                  to="/category/books"
                  className="hover:text-[#EAEFFE] hover:bg-[#7b6ccb] flex items-center p-2 pl-4 rounded-lg transition text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="p-2 rounded-full bg-[#7b6ccb] inline-grid mr-2">
                    <NotebookText size={18} className="text-[#EAEFFE]" />
                  </div>
                  <span className="p-2"> Livros </span>
                </Link>

                <Link
                  to="/category/electronics"
                  className="hover:text-[#EAEFFE] hover:bg-[#7b6ccb] flex items-center p-2 pl-4 rounded-lg transition text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="p-2 rounded-full bg-[#7b6ccb] inline-grid mr-2">
                    <TabletSmartphone size={18} className="text-[#EAEFFE]" />
                  </div>
                  <span className="p-2"> Eletrônicos </span>
                </Link>

                <Link
                  to="/category/officesupplies"
                  className="hover:text-[#EAEFFE] hover:bg-[#7b6ccb] flex items-center p-2 pl-4 rounded-lg transition text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="p-2 rounded-full bg-[#7b6ccb] inline-grid mr-2">
                    <ScrollText size={18} className="text-[#EAEFFE]" />
                  </div>
                  <span className="p-2"> Materiais de Escritório </span>
                </Link>
              </nav>
            </motion.div>

            {/* Fundo com blur */}
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
              onClick={toggleSidebar}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
