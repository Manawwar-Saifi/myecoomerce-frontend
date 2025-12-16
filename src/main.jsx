import { StrictMode } from "react";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./style.css"; // ✅ This is critical for Tailwind to apply
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { NotificationProvider } from "./contexts/NotificationContext.jsx";
// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // 1 hour
      cacheTime: 1000 * 60 * 60 * 2, // 2 hours
    },
  },
});

// LocalStorage persister
const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});

// Persist cache
persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  maxAge: 1000 * 60 * 60 * 2, // 2 hours
});
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
