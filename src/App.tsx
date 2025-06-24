import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import VideoFeed from "./pages/VideoFeed";
import SellItem from "./pages/SellItem";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import HowItWorks from "./pages/HowItWorks";
import SafetyGuide from "./pages/SafetyGuide";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Shipping from "./pages/Shipping";
import ProjectHelp from "./pages/ProjectHelp";
import ProjectLocation from "./pages/ProjectLocation";
import AndroidDownloads from "./pages/AndroidDownloads";
import CodeAccess from "./pages/CodeAccess";
import ProjectSaver from "./pages/ProjectSaver";
import PCFileTransfer from "./pages/PCFileTransfer";
import DownloadHelp from "./pages/DownloadHelp";
import EmailHelp from "./pages/EmailHelp";
import PackageJson from "./pages/PackageJson";
import FileManager from "./pages/FileManager";
import SrcFiles from "./pages/SrcFiles";
import CategoryPage from "./pages/CategoryPage";
import FAQPage from "./pages/FAQPage";
import PaymentSuccess from "./pages/PaymentSuccess";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Index />} />
      <Route path="/video-feed" element={<VideoFeed />} />
      <Route path="/feed" element={<VideoFeed />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/sell" element={<SellItem />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/safety" element={<SafetyGuide />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/shipping" element={<Shipping />} />
      <Route path="/project-help" element={<ProjectHelp />} />
      <Route path="/project-location" element={<ProjectLocation />} />
      <Route path="/android-downloads" element={<AndroidDownloads />} />
      <Route path="/code-access" element={<CodeAccess />} />
      <Route path="/project-saver" element={<ProjectSaver />} />
      <Route path="/pc-transfer" element={<PCFileTransfer />} />
      <Route path="/download-help" element={<DownloadHelp />} />
      <Route path="/email-help" element={<EmailHelp />} />
      <Route path="/package-json" element={<PackageJson />} />
      <Route path="/files" element={<FileManager />} />
      <Route path="/src-files" element={<SrcFiles />} />
      <Route path="/category/:slug" element={<CategoryPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="*" element={<NotFound />} />
    </>
  ),
  {
    basename: '/',
  }
);

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <RouterProvider router={router} />
          </TooltipProvider>
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;