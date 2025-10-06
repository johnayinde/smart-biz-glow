// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { queryClient } from "@/lib/react-query";
import { MainLayout } from "@/components/layout/main-layout";
import { PublicLayout } from "@/components/layout/public-layout";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PublicRoute } from "@/components/auth/PublicRoute";

// Public pages
import Landing from "./pages/landing";
import About from "./pages/about";
import Contact from "./pages/contact";

// Auth pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import PasswordReset from "./pages/auth/PasswordReset";

// Protected pages
import Dashboard from "./pages/dashboard";
import Invoices from "./pages/invoices";
import InvoiceTemplates from "./pages/invoice-templates";
import Clients from "./pages/clients/index";
import ClientDetail from "./pages/clients/client-detail";
import Payments from "./pages/payments";
import Analytics from "./pages/analytics";
import Insights from "./pages/insights";
import Settings from "./pages/settings";
import Notifications from "./pages/notifications";
import InvoiceDetail from "./pages/invoices/invoice-detail";
import Subscription from "./pages/subscription";
import NotFound from "./pages/not-found";
import CreateInvoice from "./pages/invoices/new";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes with navbar/footer */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Route>

              {/* Auth routes (no layout, redirect if authenticated) */}
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/reset-password" element={<PasswordReset />} />
              </Route>

              {/* Protected routes (require authentication) */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/clients/:id" element={<ClientDetail />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/invoices/new" element={<CreateInvoice />} />
                  <Route path="/invoices/:id" element={<InvoiceDetail />} />
                  <Route
                    path="/invoice-templates"
                    element={<InvoiceTemplates />}
                  />
                  {/* <Route path="/payments" element={<Payments />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/insights" element={<Insights />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/subscription" element={<Subscription />} /> */}
                </Route>
              </Route>

              {/* 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
