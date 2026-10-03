import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Magnetic } from '../components/motion/Magnetic';
import { InteractiveWord } from '../components/motion/InteractiveWord';
import { InteractiveKeyboard } from '../components/motion/InteractiveKeyboard';
import { TiltPassportCard } from '../components/motion/TiltPassportCard';
import { InteractiveLifecycleMatrix } from '../components/motion/InteractiveLifecycleMatrix';
import { ImmersiveAISection } from '../components/motion/ImmersiveAISection';
import { IntroSequence } from '../components/common/IntroSequence';
import { TopRepairersShowcase } from '../components/repairers/TopRepairersShowcase';
import CursorGrid from '../components/canvas/CursorGrid';
import Topography from '../components/Topography';
import VariableProximity from '../components/motion/VariableProximity';
import { useApp } from '../context/AppContext';
import { 
  QrCode, 
  ArrowRight, 
  Sparkles, 
  ChevronRight, 
  ShieldCheck, 
  Wrench, 
  ShoppingBag, 
  Recycle,
  Cpu,
  CheckCircle2,
  FileText,
  MapPin,
  ExternalLink
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { products, repairers, recoveryPartners } = useApp();
  const benchmarkProduct = products.find(p => p.productId === 'RP-DL-72891') || products[0];

  const heroHeadlineRef = useRef<HTMLHeadingElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll();

  // Scroll animations for Section 01 Text Morph
  const storyPhase1Opacity = useTransform(scrollYProgress, [0.08, 0.14, 0.20], [0, 1, 0]);
  const storyPhase1Y = useTransform(scrollYProgress, [0.08, 0.14, 0.20], [30, 0, -30]);

  const storyPhase2Opacity = useTransform(scrollYProgress, [0.18, 0.24, 0.30], [0, 1, 0]);
  const storyPhase2Y = useTransform(scrollYProgress, [0.18, 0.24, 0.30], [30, 0, -30]);

  const storyPhase3Opacity = useTransform(scrollYProgress, [0.28, 0.34, 0.40], [0, 1, 0]);
  const storyPhase3Y = useTransform(scrollYProgress, [0.28, 0.34, 0.40], [30, 0, -30]);

  // Lifecycle Continuous Animated Line Progress
  const lineProgress = useTransform(scrollYProgress, [0.60, 0.88], ['0%', '100%']);

  const lifecycleStages = [
    { title: 'PURCHASED', sub: 'Factory mint & identity assignment', color: '#F59E0B' },
    { title: 'USED', sub: 'Daily compute & wear logging', color: '#A1A1AA' },
    { title: 'MAINTAINED', sub: 'Thermal paste & firmware sync', color: '#06B6D4' },
    { title: 'REPAIRED', sub: 'OEM battery swap by TechFix', color: '#10B981' },
    { title: 'RESOLD', sub: 'Second-owner digital escrow', color: '#06B6D4' },
    { title: 'SECOND LIFE', sub: 'Extended utility + 3 years', color: '#10B981' },
    { title: 'RECOVERED', sub: 'RAM, SSD & panel harvest', color: '#A855F7' },
    { title: 'RECYCLED', sub: 'Smelting precious closed-loop metals', color: '#14B8A6' }
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen text-[#F5F5F5] font-sans selection:bg-amber-400/20 selection:text-amber-300">
      
      {/* 00 — INSTANT LOAD (Zero-delay intro sequence) */}
      <IntroSequence />

      {/* React Bits CursorGrid Interactive Canvas Layer (Landing Page only) */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        <CursorGrid
          cellSize={65}
          color="#F59E0B"
          radius={140}
          falloff="smooth"
          holdTime={400}
          fadeDuration={800}
          lineWidth={1.2}
          maxOpacity={0.8}
          fillOpacity={0.05}
          gridOpacity={0.06}
          cellRadius={4}
          clickPulse={true}
          pulseSpeed={600}
        />
      </div>

      {/* =========================================================================
          01 — HERO SECTION: INTENTIONAL YC SAAS HIERARCHY
          Small context label → Clear headline → Short explanation → Primary/Secondary CTAs
          → ACTUAL PRODUCT INTERFACE PREVIEW
          ========================================================================= */}
      <section id="hero" className="relative pt-12 sm:pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        <div className="space-y-6 w-full max-w-5xl mx-auto">
          {/* Small product / context label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>RETRACE PROTOCOL</span>
            <span className="text-zinc-600">/</span>
            <span>CIRCULAR HARDWARE INTELLIGENCE</span>
          </div>

          {/* Clear, restrained SaaS headline */}
          <h1 
            ref={heroHeadlineRef}
            className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white max-w-4xl mx-auto leading-[1.08] relative select-none cursor-default"
          >
            <VariableProximity
              label="Give Every Physical Product"
              className="text-white"
              fromFontVariationSettings="'wght' 400, 'opsz' 9"
              toFontVariationSettings="'wght' 1000, 'opsz' 40"
              containerRef={heroHeadlineRef}
              radius={100}
              falloff="linear"
            />
            <br className="hidden sm:inline" />{' '}
            <VariableProximity
              label="a Next Path."
              className="text-amber-400"
              fromFontVariationSettings="'wght' 400, 'opsz' 9"
              toFontVariationSettings="'wght' 1000, 'opsz' 40"
              containerRef={heroHeadlineRef}
              radius={100}
              falloff="linear"
            />
          </h1>

          {/* Short explanation */}
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            ReTrace gives physical devices a permanent digital passport and determines what happens next — authenticating repairs, syncing parts provenance, and orchestrating circular resale, harvest, or certified recycling.
          </p>

          {/* Primary CTA + Secondary Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/scan"
              className="px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-black" />
              <span>SCAN PRODUCT QR</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/products/new"
              className="px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 text-xs font-medium tracking-wide flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Register New Device</span>
            </Link>

            <Link
              to="/passport/RP-DL-72891"
              className="px-4 py-2.5 rounded-lg text-zinc-400 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Benchmark Passport</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </Link>
          </div>

          {/* Actual Product Interface Preview Window */}
          <div className="pt-8 max-w-4xl mx-auto">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 shadow-2xl overflow-hidden text-left">
              {/* Product Frame Window Bar */}
              <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  </div>
                  <span className="text-zinc-500 ml-2">retrace.id/p/RP-DL-72891</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-emerald-400 text-[10px] font-semibold">VERIFIED LEDGER</span>
                </div>
              </div>

              {/* Product Preview Body */}
              <div className="p-6">
                <TiltPassportCard product={benchmarkProduct} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          02 — PROBLEM & PROTOCOL FOUNDATION (3-COLUMN REAL PRODUCT GRID)
          ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-800/80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider block">
              01 / THE UNSEEN ORIGIN
            </span>
            <h3 className="font-semibold text-lg text-white">
              Every Product Has a History
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-mono">
              Every circuit board represents rare earths, precision fabrication, and embedded human carbon.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <span className="font-mono text-[10px] text-rose-400/80 uppercase tracking-wider block">
              02 / THE INFORMATION GAP
            </span>
            <h3 className="font-semibold text-lg text-white">
              Most History Disappears
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-mono">
              Invoices get lost, repair logs evaporate, and functional electronics are discarded prematurely.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <span className="font-mono text-[10px] text-amber-400 uppercase tracking-wider block">
              03 / THE RETRACE PROTOCOL
            </span>
            <h3 className="font-semibold text-lg text-white">
              Permanent Digital Identity
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-mono">
              A tamper-proof ledger linking hardware state, verified technicians, and circular pathways.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          03 — THE 3D PHYSICAL MECHANICAL KEYBOARD STORYTELLING SECTION
          Signature Feature: Emerge from bottom, tilt with mouse, automated typing of
          REPAIR -> RESELL -> RECOVER -> RECYCLE -> NEXT PATH
          Transitioning smoothly into the PRODUCT PASSPORT!
          ========================================================================= */}
      <section id="keyboard-story" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <InteractiveKeyboard />
      </section>

      {/* =========================================================================
          04 — PRODUCT PASSPORT: FLOATING 3D OBJECT WITH CURSOR TILT & TIMELINE
          DELL INSPIRON 15 | RP-DL-72891 | GOOD CONDITION | 2 VERIFIED REPAIRS
          PURCHASED 2024 | LAST SERVICE 12 SEP 2026 | REPAIRABILITY HIGH | RESALE ₹18,000–₹21,000
          WORKING QR CODE -> /passport/RP-DL-72891
          ========================================================================= */}
      <section id="passport" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="font-mono text-xs text-amber-400 uppercase tracking-widest block">
            PHYSICAL IDENTITY PASSPORT
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            The Digital Product Passport.
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Every product possesses a permanent digital passport. Hover to tilt in 3D space, or scan the QR code to open its live verified ledger.
          </p>
        </div>

        {/* 3D Passport Card with Integrated Timeline and Working QR */}
        <TiltPassportCard product={benchmarkProduct} />
      </section>

      {/* =========================================================================
          05 — AI ASSESSMENT: WHAT'S WRONG WITH YOUR PRODUCT?
          Typing Reveal: "My laptop is overheating and shutting down."
          Cinematic AI Diagnostic: Thermal System, Repairability High, Parts Available, Recommended Action
          Visual Relationship Graph: User Symptom -> AI Analysis -> Product History -> Cause -> Repairability -> Next Path
          ========================================================================= */}
      <section id="ai-assessment" className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ImmersiveAISection />
      </section>

      {/* =========================================================================
          06 — NEXT PATH: INTERACTIVE CONVERGENCE (REPAIR / RESELL / RECOVER / RECYCLE)
          3D Depth: selected expands and comes forward, other paths move backward.
          ========================================================================= */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="font-mono text-xs text-amber-400 uppercase tracking-widest block">
            CIRCULAR NEXT PATH
          </span>
          <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight">
            What should happen next?
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Move cursor over each path to examine real-time repairability, estimated recovery value, and verified partner networks.
          </p>
        </div>

        {/* Interactive Matrix Component with 3D depth */}
        <InteractiveLifecycleMatrix />
      </section>

      {/* =========================================================================
          07 — CONTINUOUS LIFECYCLE (ONE CONTINUOUS ANIMATED LINE)
          PURCHASED -> USED -> MAINTAINED -> REPAIRED -> RESOLD -> SECOND LIFE -> RECOVERED -> RECYCLED
          ========================================================================= */}
      <section id="lifecycle" className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="font-mono text-xs text-amber-400 uppercase tracking-widest block">
            ONE CONTINUOUS LIFECYCLE
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            The Closed Loop Arc.
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            From the initial factory gate to secondary resale and ultimate hydrometallurgical recovery.
          </p>
        </div>

        {/* Continuous Animated Circuit Line */}
        <div className="relative max-w-5xl mx-auto">
          {/* Base Track Line */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/[0.08] -translate-y-1/2 hidden md:block" />

          {/* Animated Glowing Progress Line */}
          <motion.div
            style={{ width: lineProgress }}
            className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-amber-400 via-cyan-400 to-emerald-400 -translate-y-1/2 hidden md:block shadow-[0_0_15px_#F59E0B]"
          />

          {/* Grid of Lifecycle Stages */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 relative z-10">
            {lifecycleStages.map((stage, idx) => (
              <motion.div
                key={stage.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                className="p-3.5 rounded-2xl bg-[#0f0f16]/90 border border-white/[0.08] flex flex-col justify-between text-center relative group hover:border-amber-400/40 transition-colors"
              >
                {/* Node Pill */}
                <div className="w-2.5 h-2.5 rounded-full mx-auto mb-2 bg-[#121218] border-2 border-amber-400 shadow-[0_0_8px_#F59E0B] group-hover:scale-125 transition-transform" />

                <div className="space-y-1">
                  <div className="font-mono text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                    {stage.title}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500 leading-tight">
                    {stage.sub}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          08 — VERIFIED REPAIR: FLOATING RECORD
          BATTERY REPLACEMENT | 12 SEP 2026 | REPAIRER VERIFIED ✓ | DOCUMENT VERIFIED ✓
          PART: Original Battery | REPAIRER: TechFix
      {/* =========================================================================
          08 — VERIFIED REPAIR: AUDIT RECORD
          ========================================================================= */}
      <section id="verified-repair" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 border-t border-zinc-800/80">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="font-mono text-xs text-amber-400 uppercase tracking-wider block">
            VERIFIABLE AUDIT LEDGER
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
            Proof in Every Solder.
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Every replacement component is authenticated and signed by licensed repair facilities.
          </p>
        </div>

        {/* Verified Record Card */}
        <div className="max-w-2xl mx-auto">
          <div className="p-6 sm:p-8 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-5">
            {/* Record Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-mono text-xs font-semibold text-white tracking-wider">
                  BATTERY REPLACEMENT
                </span>
              </div>
              <span className="font-mono text-xs text-zinc-400">12 SEP 2026</span>
            </div>

            {/* Verification Badges */}
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                REPAIRER VERIFIED ✓
              </span>
              <span className="px-2.5 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 font-medium flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-zinc-400" />
                DOCUMENT VERIFIED ✓
              </span>
            </div>

            {/* Part & Technician Details */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg bg-zinc-950/60 border border-zinc-800 font-mono text-xs">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block mb-0.5">PART INSTALLED</span>
                <span className="text-white font-medium text-sm">Original Dell Battery 56Wh</span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">SN: DL-BAT-882193</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block mb-0.5">AUTHORIZED REPAIRER</span>
                <span className="text-amber-400 font-medium text-sm">TechFix Solutions</span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">Lic: #TF-IND-2024</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs font-mono">
              <span className="text-zinc-500">SIGNATURE: 0x9b7f...c421</span>
              <Link to="/passport/RP-DL-72891" className="text-amber-400 hover:underline flex items-center gap-1">
                <span>View Passport Audit</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          09 — TOP REPAIRERS ANIMATED CINEMATIC SHOWCASE (DYNAMIC DATABASE RANKING)
          ========================================================================= */}
      <TopRepairersShowcase />

      {/* =========================================================================
          10 — SECOND LIFE RESALE WITH ATTACHED DIGITAL PASSPORT
          ========================================================================= */}
      <section id="resale" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 border-t border-zinc-800/80">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="font-mono text-xs text-amber-400 uppercase tracking-wider block">
            SECONDARY MARKETPLACE
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
            Second Life Starts with Trust.
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            No blind purchases or disguised defects. Every resale listing attaches its verifiable cryptographic passport.
          </p>
        </div>

        {/* Resale Showcase Card */}
        <div className="max-w-xl mx-auto">
          <div className="p-6 sm:p-8 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-xs font-mono text-zinc-500 uppercase">OFFICIAL LISTING</span>
                <h3 className="font-bold text-xl text-white">DELL INSPIRON 15</h3>
              </div>
              <span className="font-bold text-xl text-amber-400">
                ₹18,000–₹21,000
              </span>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                GOOD CONDITION
              </span>
              <span className="px-2.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                2 VERIFIED REPAIRS
              </span>
              <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                DIGITAL PASSPORT ✓
              </span>
            </div>

            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              Battery replaced 12 Sep 2026 with OEM pack. Verified thermal repasting performed. Full passport history transfers to buyer on checkout.
            </p>

            <div className="pt-2">
              <Link
                to="/resale"
                className="w-full py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>CREATE LISTING / EXPLORE RESALE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          11 — RECOVERY & END OF LIFE:
          ========================================================================= */}
      <section id="recovery" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 border-t border-zinc-800/80">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <span className="font-mono text-xs text-amber-400 uppercase tracking-wider block">
            CLOSED LOOP EXTRACTION
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
            When repair is no longer practical...
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            ReTrace orchestrates direct courier handoff to certified circular recyclers.
          </p>
        </div>

        {/* 3 Recovery Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2.5">
            <Cpu className="w-6 h-6 text-amber-400" />
            <h4 className="font-bold text-base text-white">SELL FOR PARTS</h4>
            <p className="text-xs font-mono text-zinc-400 leading-relaxed">
              Recover operational 16GB DDR4 RAM, NVMe SSDs, display flex cables, and charger modules.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2.5">
            <Recycle className="w-6 h-6 text-zinc-300" />
            <h4 className="font-bold text-base text-white">MATERIAL RECOVERY</h4>
            <p className="text-xs font-mono text-zinc-400 leading-relaxed">
              Aluminum top casing and copper heat pipes routed into high-efficiency secondary foundries.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2.5">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h4 className="font-bold text-base text-white">E-WASTE RECYCLING</h4>
            <p className="text-xs font-mono text-zinc-400 leading-relaxed">
              R2v3 compliant smelting of mainboard traces extracting gold, palladium, and solder.
            </p>
          </div>
        </div>

        {/* End of Life Statement */}
        <div className="max-w-3xl mx-auto text-center pt-8 space-y-4">
          <div className="font-display font-bold text-2xl sm:text-4xl text-white tracking-tight leading-snug">
            The Product May End. <br />
            <span className="text-amber-400">The Material Doesn&apos;t Have To.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
            <span className="px-3 py-1 rounded-md bg-zinc-900 text-zinc-300 border border-zinc-800">
              COLLECTED ✓
            </span>
            <span className="px-3 py-1 rounded-md bg-zinc-900 text-zinc-300 border border-zinc-800">
              RECOVERY VERIFIED ✓
            </span>
            <span className="px-3 py-1 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/30 font-semibold">
              MATERIAL RECOVERED ✓
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          12 — FINAL HERO STATEMENT
          ========================================================================= */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center border-t border-zinc-800/80 overflow-hidden rounded-3xl mb-12">
        {/* Topography Background */}
        <div className="absolute inset-0 z-0">
          <Topography 
            lowColor="#0a0a0a"
            midColor="#3f3f46"
            highColor="#f59e0b"
            speed={0.4}
            morphAmount={2.5}
            bands={1.5}
            thickness={0.012}
            scale={1.1}
            pixelSize={1.0}
            glow={0.3}
            colorMode="elevation"
            contrast={2.2}
            brightness={1.3}
            fillBands={false}
            opacity={0.4}
            mouseInteraction={true}
            mouseRadius={0.4}
            mouseStrength={0.5}
          />
        </div>
        
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808] z-0 pointer-events-none" />

        <div className="relative z-10 space-y-8 py-12">
          <div className="space-y-3">
            <h2 className="font-display font-bold tracking-tight text-3xl sm:text-5xl text-white">
              Give Every Product <br />
              <span className="text-amber-400">A Next Path.</span>
            </h2>
            <p className="font-mono text-xs text-zinc-400 tracking-wider uppercase">
              RETRACE PROTOCOL • CIRCULAR HARDWARE INTELLIGENCE
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/scan"
              className="px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>SCAN PRODUCT QR</span>
            </Link>

            <Link
              to="/products/new"
              className="px-5 py-2.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 backdrop-blur-sm text-white border border-zinc-700 font-medium text-xs tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Create Product Passport</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
