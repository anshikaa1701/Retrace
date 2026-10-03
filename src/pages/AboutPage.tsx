import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  QrCode, 
  Wrench, 
  ShoppingBag, 
  Recycle, 
  Cpu, 
  CheckCircle2,
  Clock,
  Compass
} from 'lucide-react';

const LIFECYCLE_STAGES = [
  {
    step: '01',
    title: 'IDENTITY',
    icon: QrCode,
    color: 'text-amber-400',
    borderColor: 'border-amber-400/40',
    bg: 'bg-amber-400/10',
    desc: 'Every hardware device receives a cryptographic digital passport, linking its serial, specs, and bill of materials.'
  },
  {
    step: '02',
    title: 'MAINTAIN',
    icon: Clock,
    color: 'text-cyan-400',
    borderColor: 'border-cyan-400/40',
    bg: 'bg-cyan-400/10',
    desc: 'Continuous telemetry logging of battery health, thermal paste degradation, and preventative servicing.'
  },
  {
    step: '03',
    title: 'REPAIR',
    icon: Wrench,
    color: 'text-amber-400',
    borderColor: 'border-amber-400/40',
    bg: 'bg-amber-400/10',
    desc: 'Certified local repair workshops perform component-level fixes and permanently sign the digital work order.'
  },
  {
    step: '04',
    title: 'RESELL',
    icon: ShoppingBag,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-400/40',
    bg: 'bg-emerald-400/10',
    desc: 'Verified second-life marketplace listing backed by tamper-evident battery and repair provenance.'
  },
  {
    step: '05',
    title: 'RECOVER',
    icon: Cpu,
    color: 'text-purple-400',
    borderColor: 'border-purple-400/40',
    bg: 'bg-purple-400/10',
    desc: 'When beyond repair, operational modules (RAM, display panels, SSDs) are harvested for secondary use.'
  },
  {
    step: '06',
    title: 'RECYCLE',
    icon: Recycle,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-400/40',
    bg: 'bg-emerald-400/10',
    desc: 'Certified R2v3 hydrometallurgical smelting extracting precious gold, copper, and rare-earth minerals.'
  }
];

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-20 font-sans select-none">
      
      {/* Hero Section with Subtle Ambient Glow */}
      <div className="text-center space-y-6 max-w-3xl mx-auto relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>ABOUT RETRACE</span>
          <span className="text-zinc-600">/</span>
          <span>CIRCULAR HARDWARE PROTOCOL</span>
        </div>

        <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-[1.08]">
          Giving Every Physical Product <br />
          <span className="text-amber-400">A Persistent Life.</span>
        </h1>

        <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          ReTrace gives physical products a persistent digital identity and helps extend their useful life. We connect device owners, verified repair technicians, circular resellers, and certified material recyclers into one transparent ledger.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/products/new"
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wider flex items-center gap-2 transition-all shadow-lg hover:shadow-amber-400/20 cursor-pointer"
          >
            <span>CREATE PRODUCT PASSPORT</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/how-it-works"
            className="px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-medium tracking-wide transition-colors"
          >
            <span>Explore How It Works</span>
          </Link>
        </div>
      </div>

      {/* The 6-Stage Lifecycle Flow */}
      <div className="space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="font-mono text-xs text-amber-400 uppercase tracking-widest block">
            THE RETRACE LIFECYCLE
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-4xl text-white tracking-tight">
            From First Boot to Final Smelting
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm">
            A continuous loop that keeps materials circulating and out of landfills.
          </p>
        </div>

        {/* Lifecycle Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LIFECYCLE_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <motion.div
                key={stage.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="relative p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-zinc-600">
                      {stage.step}
                    </span>
                    <div className={`w-9 h-9 rounded-xl ${stage.bg} border ${stage.borderColor} flex items-center justify-center ${stage.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white group-hover:text-amber-400 transition-colors">
                    {stage.title}
                  </h3>

                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    {stage.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>STAGE {stage.step}</span>
                  <span className="text-emerald-400">VERIFIED ✓</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Philosophy Statement */}
      <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-800 text-center space-y-6 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
        <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <div className="space-y-2 max-w-2xl mx-auto">
          <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
            Designed for the EU Ecodesign Standard (ESPR)
          </h3>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
            ReTrace is built from the ground up to comply with global Digital Product Passport (DPP) regulations. By uniting hardware schematics, local technicians, and recovery hubs, we empower consumers to maintain ownership and ensure products never face premature retirement.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/products/new"
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wider transition-colors cursor-pointer"
          >
            CREATE PRODUCT PASSPORT
          </Link>
          <Link
            to="/facilities"
            className="px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs tracking-wider transition-colors cursor-pointer"
          >
            VIEW PLATFORM FACILITIES
          </Link>
        </div>
      </div>

    </div>
  );
};
