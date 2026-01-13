import AppRoutes from "./routes/routes";
import ChatModal from "./components/ChatModal";
import InboxModal from "./components/InboxModal";

function App() {
  return (
    <main className="flex-grow w-full">
      <AppRoutes />
      <InboxModal />
      <ChatModal />
    </main>
  );
}

export default App;
