import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BottomNav } from "@/components/layout/BottomNav";
import Index from "./pages/Index";
import Members from "./pages/Members";
import MemberDetail from "./pages/MemberDetail";
import NewMember from "./pages/NewMember";
import Sessions from "./pages/Sessions";
import SessionDetail from "./pages/SessionDetail";
import NewSession from "./pages/NewSession";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/members" element={<Members />} />
          <Route path="/members/new" element={<NewMember />} />
          <Route path="/members/:id" element={<MemberDetail />} />
          <Route path="/members/:id/edit" element={<NewMember />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/sessions/new" element={<NewSession />} />
          <Route path="/sessions/:id" element={<SessionDetail />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
