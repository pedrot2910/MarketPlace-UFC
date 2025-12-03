import AppRoutes from "./routes/routes";
import ChatModal from "./components/ChatModal";

function App() {
  return (
    <main className="flex-grow w-full">
      <AppRoutes />
      <ChatModal />
    </main>
  );
}

export default App;
