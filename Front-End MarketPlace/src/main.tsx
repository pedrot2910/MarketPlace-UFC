import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./hooks/auth/AuthContext.tsx";
import "./index.css";
import App from "./App.tsx";
import { NotificationProvider } from "./contexts/NotificationContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);
