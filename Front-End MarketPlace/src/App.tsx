import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/routes";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      {/* Garante que ocupe toda a tela */}
      <div className="min-h-screen bg-[#EAEFFE] text-[#2D274B]">
        <Navbar />

        {/* Main ocupa todo o espaço visível */}
        <main className="flex-grow w-full">
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
