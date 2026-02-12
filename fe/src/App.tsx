import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import LandingPage from "./pages/LandingPage";
import AppShell from "./components/layout/AppShell";
import ChatView from "./components/chat/ChatView";
import HistoryView from "./components/transaction/HistoryView";
import SettingsView from "./pages/SettingsView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={<AppShell />}>
              <Route index element={<ChatView />} />
              <Route path="c/:id" element={<ChatView />} />
              <Route path="history" element={<HistoryView />} />
              <Route path="settings" element={<SettingsView />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
