import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { HomePage } from "./pages/HomePage";
import { SitesPage } from "./pages/SitesPage";
import { ARPage } from "./pages/ARPage";
import { Toaster } from "./components/ui/sonner";

/**
 * Main App component with React Router setup
 * Handles all routing logic and provides global layout structure
 */
export default function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      {/* Automatically scrolls to top on route changes */}
      <ScrollToTop />
      <div className="min-h-screen" style={{ background: "var(--background)" }}>
        <Header />
        <main className="pt-20 bg-card">
          {" "}
          {/* Top padding to account for fixed header */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sites" element={<SitesPage />} />
            <Route path="/ar" element={<ARPage />} />
            <Route path="/ar/:siteId" element={<ARPage />} />{" "}
            {/* Direct AR view for specific site */}
            {/* Development and fallback routes */}
            <Route path="/preview_page.html" element={<HomePage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
        {/* Global toast notifications */}
        <Toaster />
      </div>
    </Router>
  );
}
