
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Search from "./pages/Search";
import ListingDetail from "./pages/ListingDetail";
import Profile from "./pages/Profile";
import NewListing from "./pages/NewListing";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import BottomNav from "./components/BottomNav";
import { useIsMobile } from "./hooks/use-mobile";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  const isMobile = useIsMobile();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className={`${isMobile ? 'max-w-md' : 'max-w-xl'} mx-auto min-h-screen relative bg-background`}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/listing/:id" element={<ListingDetail />} />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/new-listing" element={
                  <ProtectedRoute>
                    <NewListing />
                  </ProtectedRoute>
                } />
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <BottomNav />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
