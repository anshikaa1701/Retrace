import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { InteractiveBackground } from './components/canvas/InteractiveBackground';
import { DemoControlBar } from './components/common/DemoControlBar';
import { RepathAIButton } from './components/ai/RepathAIButton';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { ScanPage } from './pages/ScanPage';
import { ProductPassportPage } from './pages/ProductPassportPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { RepairersPage } from './pages/RepairersPage';
import { RepairerProfilePage } from './pages/RepairerProfilePage';
import { AddRepairShopPage } from './pages/AddRepairShopPage';
import { RepairerDashboardPage } from './pages/RepairerDashboardPage';
import { SparePartsPage } from './pages/SparePartsPage';
import { ResalePage } from './pages/ResalePage';
import { RecoveryPage } from './pages/RecoveryPage';
import { RecyclerDashboardPage } from './pages/RecyclerDashboardPage';
import { AdminPage } from './pages/AdminPage';
import { CreateProductPage } from './pages/CreateProductPage';
import { AboutPage } from './pages/AboutPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { RepairPage } from './pages/RepairPage';
import { RecyclingPage } from './pages/RecyclingPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

import AeroShards from './components/canvas/AeroShards';
import MagicRings from './components/canvas/MagicRings';

// Scroll to top helper on route transition
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Helper to identify the 5 designated pages for AeroShards animation:
// 1. Products (/products, /dashboard)
// 2. AI Diagnostic (/ai-assistant)
// 3. Repairers (/repairers)
// 4. Resale (/resale)
// 5. Recovery (/recovery, /recover)
const isAeroShardsPage = (pathname: string): boolean => {
  if (pathname === '/products' || pathname.startsWith('/products/') || pathname === '/dashboard') {
    return true;
  }
  if (pathname === '/ai-assistant' || pathname.startsWith('/ai-assistant/')) {
    return true;
  }
  if (pathname === '/repairers' || pathname.startsWith('/repairers/')) {
    return true;
  }
  if (pathname === '/resale' || pathname.startsWith('/resale/')) {
    return true;
  }
  if (pathname === '/recovery' || pathname.startsWith('/recovery/') || pathname === '/recover' || pathname.startsWith('/recover/')) {
    return true;
  }
  return false;
};

// Route-aware background animation system:
// - Landing page (/): uses CursorGrid inside LandingPage.tsx
// - 5 Target Pages (Products, AI Diagnostic, Repairers, Resale, Recovery): AeroShards ONLY (MagicRings removed)
// - All other non-landing pages: MagicRings
const RouteBackground: React.FC = () => {
  const { pathname } = useLocation();

  // Landing page has its own dedicated CursorGrid animation inside LandingPage.tsx
  if (pathname === '/') return null;

  // Render AeroShards on the 5 designated pages ONLY, replacing previous animation
  if (isAeroShardsPage(pathname)) {
    return (
      <div 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-55 mix-blend-screen transition-opacity duration-700"
        aria-hidden="true"
      >
        <AeroShards
          backgroundColor="#080808"
          shardColor="#F59E0B"
          accentColor="#10B981"
          placement="full"
          flow="stream"
          material="pearl"
          detail="balanced"
          effect="none"
          scale={1}
          spread={1}
          depth={1}
          speed={0.8}
          spin={0.8}
          interaction="repel"
          density={1.3}
          shardSize={1.1}
          stretch={1}
          turbulence={0.9}
          glow={1.1}
          edgeSoftness={2}
          bloom={0.45}
          grain={0.04}
          chromaticAberration={0.006}
          transitionDuration={1}
          interactionRadius={1.5}
          interactionStrength={0.5}
          rippleIntensity={1}
          holdToGather={true}
          onError={(err) => {
            console.warn('[AeroShards WebGPU notice]:', err?.message || err);
          }}
        />
      </div>
    );
  }

  // Render MagicRings on other non-landing pages
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-35"
      aria-hidden="true"
    >
      <MagicRings
        color="#F59E0B"
        colorTwo="#10B981"
        ringCount={6}
        speed={0.8}
        attenuation={12}
        lineThickness={1.8}
        baseRadius={0.32}
        radiusStep={0.11}
        scaleRate={0.08}
        opacity={0.8}
        blur={0}
        noiseAmount={0.08}
        rotation={0}
        ringGap={1.5}
        fadeIn={0.6}
        fadeOut={0.6}
        followMouse={true}
        mouseInfluence={0.15}
        hoverScale={1.15}
        parallax={0.04}
        clickBurst={true}
      />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-[#080808] text-[#F5F5F5] flex flex-col font-sans relative selection:bg-emerald-500/20 selection:text-emerald-300">
          
          {/* Full-screen Cursor-Reactive Background System */}
          <InteractiveBackground />

          {/* Route-aware background animation (AeroShards on 5 target pages, MagicRings on other subpages) */}
          <RouteBackground />

          {/* Floating Unobtrusive Hackathon HUD Pill (Bottom Left) */}
          <DemoControlBar />

          {/* Persistent Floating AI Technical Assistant (Bottom Right) */}
          <RepathAIButton />

          {/* Translucent Glass Navbar */}
          <Navbar />

          {/* Main View Router */}
          <main className="flex-1 relative z-10">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/signup" element={<AuthPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/products" element={<DashboardPage />} />
              <Route path="/products/new" element={<CreateProductPage />} />
              <Route path="/register-product" element={<CreateProductPage />} />
              <Route path="/register" element={<CreateProductPage />} />
              <Route path="/scan" element={<ScanPage />} />
              <Route path="/passport/:productId" element={<ProductPassportPage />} />
              <Route path="/ai-assistant" element={<AIAssistantPage />} />
              <Route path="/repairers" element={<RepairersPage />} />
              <Route path="/repairers/:id" element={<RepairerProfilePage />} />
              <Route path="/repairer/register" element={<AddRepairShopPage />} />
              <Route path="/repairer/profile/:id" element={<RepairerProfilePage />} />
              <Route path="/repair-requests" element={<RepairerDashboardPage />} />
              <Route path="/repairer/dashboard" element={<RepairerDashboardPage />} />
              <Route path="/parts" element={<SparePartsPage />} />
              <Route path="/resale" element={<ResalePage />} />
              <Route path="/resale/create" element={<ResalePage />} />
              <Route path="/recovery" element={<RecoveryPage />} />
              <Route path="/recovery/:id" element={<RecoveryPage />} />
              <Route path="/recycler/dashboard" element={<RecyclerDashboardPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/facilities" element={<FacilitiesPage />} />
              <Route path="/repair" element={<RepairPage />} />
              <Route path="/recover" element={<RecoveryPage />} />
              <Route path="/recycling" element={<RecyclingPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          {/* Minimalist Editorial Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
