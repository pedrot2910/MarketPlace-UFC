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
  Sofa,
  KeyboardMusic,
  Volleyball,
  Stethoscope,
  Shirt,
  HeartPulse,
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
        className="top-4 left-4 z-60 p-2 text-[var(--color-text-invert)] rounded-lg hover:bg-[var(--color-accent)] transition-all duration-200"
      >
        {isOpen === false && <Menu size={24} />}
      </button>

      {showMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="relative bg-[var(--color-primary)] rounded-3xl shadow-2xl w-full max-w-3xl p-8 animate-fadeIn">
            {/* Botão de fechar */}
            <button
              onClick={() => setShowMap(false)}
              className="absolute right-8 top-6 text-[var(--color-text-muted)] hover:text-[var(--color-text-invert)] transition"
              aria-label="Fechar"
            >
              ✕
            </button>

            {/* Título */}
            <h2 className="text-2xl font-bold text-center text-[var(--color-text-invert)] mb-6">
              Essa é a sua localização
            </h2>

            {/* Conteúdo */}
            <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-md bg-[var(--color-bg-alt)]">
              <UserLocationMapOSM onLocationSelect={handleLocationSelect} />
            </div>

            {/* Rodapé */}
            <div className="mt-6 text-center">
              <p className="text-sm text-[var(--color-text-muted)]">
                Sua localização será usada para exibir produtos próximos a você.
              </p>
              <div className="mt-5 flex justify-center gap-4">
                <button
                  onClick={() => {
                    setShowMap(false);
                  }}
                  className="px-6 py-2 rounded-xl font-semibold bg-[var(--color-bg-alt)] text-[var(--color-text)] hover:bg-[var(--color-border)] transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmLocation}
                  className="px-6 py-2 rounded-xl font-semibold bg-[var(--color-secondary-dark)] text-[var(--color-text-invert)] hover:bg-[var(--color-secondary)]/90 shadow-md transition-all duration-200"
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
              className="fixed top-0 left-0 h-full w-72 bg-[var(--color-primary)] text-[var(--color-text-invert)] shadow-2xl z-60 flex flex-col overflow-y-auto scrollbar-custom"
            >
              {/* Cabeçalho com logo e nome */}
              <div className="flex items-center gap-1 mb-6 mt-12 px-8 py-3 bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-primary-light)] rounded-r-3xl shadow-inner">
                <motion.img
                  src="/logoruim3.png"
                  alt="Logo ReUse"
                  className="w-15 h-15 object-fill drop-shadow-lg"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                />
                <motion.h2
                  className="text-3xl font-bold text-[var(--color-text-invert)]"
                  style={{
                    WebkitTextStroke: "1px rgba(236, 72, 153, 0.3)",
                    textShadow: "0 0 8px rgba(236, 72, 153, 0.3)",
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link to="/home" onClick={() => setIsOpen(false)}>
                    <motion.img src="/logoruim4.png" alt="Logo ReUse" className="w-28 h-20 object-fill drop-shadow-lg" />
                  </Link>
                </motion.h2>
              </div>

              {/* Navegação */}
              <nav className="flex flex-col space-y-3 px-4">
                <div className="relative w-full max-w-sm">
                  <Search
                    size={20}
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--color-text-muted)]"
                  />

                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="w-full pl-10 pr-4 py-2 bg-white/90 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] shadow-sm"
                  />
                </div>

                <Link
                  to="/marketplace"
                  className="flex items-center hover:text-[var(--color-text-invert)] hover:bg-[var(--color-accent)] p-2 pl-4 rounded-lg transition-all duration-200 text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="p-2 rounded-full bg-[var(--color-secondary-dark)] inline-grid mr-2">
                    <Store size={18} className="text-[var(--color-text-invert)]" />
                  </div>
                  <span className="pl-2">Explorar</span>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center hover:text-[var(--color-text-invert)] hover:bg-[var(--color-accent)] p-2 pl-4 rounded-lg transition-all duration-200 text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="p-2 rounded-full bg-[var(--color-secondary-dark)] inline-grid mr-2">
                    <ShoppingBag size={18} className="text-[var(--color-text-invert)]" />
                  </div>
                  <span className="pl-2">Compras</span>
                </Link>

                <button
                  className="hover:text-[var(--color-text-invert)] hover:bg-[var(--color-accent)] flex items-center p-2 pl-4 rounded-lg transition-all duration-200 text-lg"
                  onClick={() => {
                    navigate("marketplace?mode=trade");
                    setIsOpen(false);
                  }}
                >
                  <div className="p-2 rounded-full bg-[var(--color-secondary-dark)] inline-grid mr-2">
                    <ArrowRightLeft size={18} className="text-[var(--color-text-invert)]" />
                  </div>
                  <span className="pl-2">Trocas</span>
                </button>

                <button
                  className="hover:text-[var(--color-text-invert)] hover:bg-[var(--color-accent)] flex items-center p-2 pl-4 rounded-lg transition-all duration-200 text-lg"
                  onClick={() => {
                    navigate("marketplace?mode=offer");
                    setIsOpen(false);
                  }}
                >
                  <div className="p-2 rounded-full bg-[var(--color-secondary-dark)] inline-grid mr-2">
                    <BadgeDollarSign size={18} className="text-[var(--color-text-invert)]" />
                  </div>
                  <span className="pl-2">Vendas</span>
                </button>

                <hr className="border-t border-white/20" />

                <h1 className="font-semibold text-xl"> Localização </h1>

                <button
                  className="hover:text-[var(--color-text-invert)] hover:bg-[var(--color-accent)] flex items-center p-2 pl-4 rounded-lg transition-all duration-200 text-lg text-left"
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

                <hr className="border-t border-white/20" />

                <h1 className="font-semibold text-xl"> Categorias </h1>

                <Link
                  to="/category/books"
                  className="hover:text-[var(--color-text-invert)] hover:bg-[var(--color-accent)] flex items-center p-0 pl-4 rounded-lg transition-all duration-200 text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="p-2 rounded-full bg-[var(--color-secondary-dark)] inline-grid mr-2">
                    <NotebookText size={18} className="text-[var(--color-text-invert)]" />
                  </div>
                  <span className="p-2"> Livros </span>
                </Link>

                <Link
                  to="/category/electronics"
                  className="hover:text-[var(--color-text-invert)] hover:bg-[var(--color-accent)] flex items-center p-0 pl-4 rounded-lg transition-all duration-200 text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="p-2 rounded-full bg-[var(--color-secondary-dark)] inline-grid mr-2">
                    <TabletSmartphone size={18} className="text-[var(--color-text-invert)]" />
                  </div>
                  <span className="p-2"> Eletrônicos </span>
                </Link>

                <Link
                  to="/category/officesupplies"
                  className="hover:text-[var(--color-text-invert)] hover:bg-[var(--color-accent)] flex items-center p-0 pl-4 rounded-lg transition-all duration-200 text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="p-2 rounded-full bg-[var(--color-secondary-dark)] inline-grid mr-2">
                    <ScrollText size={18} className="text-[var(--color-text-invert)]" />
                  </div>
                  <span className="p-2"> Materiais de Escritório </span>
                </Link>

                 <Link
                  to="/category/furniture"
                  className="hover:text-[var(--color-text-invert)] hover:bg-[var(--color-accent)] flex items-center p-0 pl-4 rounded-lg transition-all duration-200 text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="p-2 rounded-full bg-[var(--color-secondary-dark)] inline-grid mr-2">
                    <Sofa size={18} className="text-[var(--color-text-invert)]" />
                  </div>
                  <span className="p-2"> Mobília </span>
                </Link>

                <Link
                  to="/category/musicalinstruments"
                  className="hover:text-[var(--color-text-invert)] hover:bg-[var(--color-accent)] flex items-center p-0 pl-4 rounded-lg transition-all duration-200 text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="p-2 rounded-full bg-[var(--color-secondary-dark)] inline-grid mr-2">
                    <KeyboardMusic size={18} className="text-[var(--color-text-invert)]" />
                  </div>
                  <span className="p-2"> Instrumentos Musicais </span>
                </Link>

                <Link
                  to="/category/sports"
                  className="hover:text-[var(--color-text-invert)] hover:bg-[var(--color-accent)] flex items-center p-0 pl-4 rounded-lg transition-all duration-200 text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="p-2 rounded-full bg-[var(--color-secondary-dark)] inline-grid mr-2">
                    <Volleyball size={18} className="text-[var(--color-text-invert)]" />
                  </div>
                  <span className="p-2"> Esportes </span>
                </Link>

                <Link
                  to="/category/uniforms"
                  className="hover:text-[var(--color-text-invert)] hover:bg-[var(--color-accent)] flex items-center p-0 pl-4 rounded-lg transition-all duration-200 text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="p-2 rounded-full bg-[var(--color-secondary-dark)] inline-grid mr-2">
                    <Stethoscope size={18} className="text-[var(--color-text-invert)]" />
                  </div>
                  <span className="p-2"> Uniformes e Jalecos </span>
                </Link>

                <Link
                  to="/category/clothing"
                  className="hover:text-[var(--color-text-invert)] hover:bg-[var(--color-accent)] flex items-center p-0 pl-4 rounded-lg transition-all duration-200 text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="p-2 rounded-full bg-[var(--color-secondary-dark)] inline-grid mr-2">
                    <Shirt size={18} className="text-[var(--color-text-invert)]" />
                  </div>
                  <span className="p-2"> Vestuario </span>
                </Link>

                <Link
                  to="/category/health"
                  className="hover:text-[var(--color-text-invert)] hover:bg-[var(--color-accent)] flex items-center p-0 pl-4 rounded-lg transition-all duration-200 text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="p-2 rounded-full bg-[var(--color-secondary-dark)] inline-grid mr-2">
                    <HeartPulse size={18} className="text-[var(--color-text-invert)]" />
                  </div>
                  <span className="p-2"> Saúde </span>
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
