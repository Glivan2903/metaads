
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./hooks/use-theme";
import AuthGuard from "./components/AuthGuard";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/DashboardHome";
import CampaignsPage from "./pages/CampaignsPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";
import SettingsPage from "./pages/SettingsPage";
import OAuthCallbackPage from "./pages/OAuthCallbackPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Auth routes */}
              <Route
                path="/login"
                element={
                  <AuthGuard requireAuth={false}>
                    <Login />
                  </AuthGuard>
                }
              />
              
              {/* OAuth callback route */}
              <Route path="/oauth-callback" element={<OAuthCallbackPage />} />
              
              {/* Dashboard routes */}
              <Route
                path="/dashboard"
                element={
                  <AuthGuard requireAuth={true}>
                    <Dashboard />
                  </AuthGuard>
                }
              >
                <Route index element={<DashboardHome />} />
                <Route path="campaigns" element={<CampaignsPage />} />
                <Route path="performance" element={
                  <PlaceholderPage 
                    title="Análise de Desempenho" 
                    description="Analise o desempenho de suas campanhas em profundidade" 
                  />
                } />
                <Route path="reports" element={
                  <PlaceholderPage 
                    title="Relatórios" 
                    description="Gere e visualize relatórios detalhados de suas campanhas" 
                  />
                } />
                <Route path="goals" element={
                  <PlaceholderPage 
                    title="Metas" 
                    description="Defina e acompanhe metas para suas campanhas" 
                  />
                } />
                <Route path="alerts" element={
                  <PlaceholderPage 
                    title="Alertas" 
                    description="Configure alertas personalizados para suas campanhas" 
                  />
                } />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
              
              {/* Redirect from root to dashboard or login */}
              <Route path="/" element={
                <AuthGuard requireAuth={true}>
                  <Dashboard />
                </AuthGuard>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
