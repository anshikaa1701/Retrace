import React from 'react';
import { Link } from 'react-router-dom';
import { 
  QrCode, 
  Sparkles, 
  Wrench, 
  Clock, 
  ShoppingBag, 
  Recycle, 
  Activity, 
  ArrowRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';

const FACILITIES = [
  {
    id: 'passport',
    title: 'PRODUCT PASSPORT',
    subtitle: 'Digital Identity & Lifecycle History',
    desc: 'Provides every hardware device with an immutable cryptographic digital passport, preserving its serial number, technical specifications, and component bill of materials.',
    icon: QrCode,
    link: '/products',
    linkText: 'Explore Passports',
    tag: 'CORE LEDGER'
  },
  {
    id: 'ai-assistant',
    title: 'AI TECHNICAL ASSISTANT',
    subtitle: 'Gemini-Powered Hardware Diagnostics',
    desc: 'Context-aware intelligence powered by Google Gemini 1.5 Flash. Pinpoints common low-risk hardware problems and provides safe step-by-step diagnostic actions.',
    icon: Sparkles,
    link: '/ai-assistant',
    linkText: 'Launch Assistant',
    tag: 'DIAGNOSTIC ENGINE'
  },
  {
    id: 'repair-network',
    title: 'REPAIR NETWORK',
    subtitle: 'Verified Independent Technicians',
    desc: 'Directory of certified local workshops equipped to service consumer electronics, ranked dynamically by audited repair volume and customer feedback.',
    icon: Wrench,
    link: '/repairers',
    linkText: 'Find Repairers',
    tag: 'SERVICE NETWORK'
  },
  {
    id: 'repair-history',
    title: 'REPAIR HISTORY',
    subtitle: 'Tamper-Evident Maintenance Records',
    desc: 'Logs verified part replacements, thermal servicing, and board rework. Every work order is cryptographically signed by authorized technicians.',
    icon: Clock,
    link: '/repair-requests',
    linkText: 'View Work Orders',
    tag: 'VERIFIED PROVENANCE'
  },
  {
    id: 'resale',
    title: 'RESALE',
    subtitle: 'Circular Second-Life Valuation & Listings',
    desc: 'Dynamic depreciation calculators and transparent marketplace listings backed by verified battery health and audited repair history.',
    icon: ShoppingBag,
    link: '/resale',
    linkText: 'Open Resale Market',
    tag: 'CIRCULAR MARKET'
  },
  {
    id: 'recovery',
    title: 'RECOVERY',
    subtitle: 'Component Harvesting & Materials Smelting',
    desc: 'Connects irreparable devices directly to verified hydrometallurgical refineries and component harvesters to prevent e-waste from entering landfills.',
    icon: Recycle,
    link: '/recovery',
    linkText: 'Access Recovery',
    tag: 'ZERO LANDFILL'
  },
  {
    id: 'lifecycle-tracking',
    title: 'LIFECYCLE TRACKING',
    subtitle: 'Continuous Product Lifecycle Record',
    desc: 'A permanent timeline tracking every transition: owner handoffs, warranty updates, component upgrades, and eventual recycling certificates.',
    icon: Activity,
    link: '/dashboard',
    linkText: 'Open Dashboard',
    tag: 'CONTINUOUS MONITOR'
  }
];

export const FacilitiesPage: React.FC = () => {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16 font-sans select-none">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>PLATFORM CAPABILITIES & PROTOCOL SUITE</span>
        </div>

        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
          ReTrace Facilities
        </h1>

        <p className="text-zinc-400 text-base leading-relaxed">
          Comprehensive software capabilities powering the decentralized circular hardware economy — from cryptographic passports to AI diagnostics and material smelting coordination.
        </p>
      </div>

      {/* Facilities Interactive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {FACILITIES.map((facility) => {
          const Icon = facility.icon;
          return (
            <div
              key={facility.id}
              className="p-6 sm:p-7 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {facility.tag}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-amber-400 transition-colors">
                    {facility.title}
                  </h3>
                  <p className="text-xs font-medium text-zinc-300">
                    {facility.subtitle}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                  {facility.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <Link
                  to={facility.link}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <span>{facility.linkText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[10px] font-mono text-zinc-500">OPERATIONAL ✓</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Protocol Summary Card */}
      <div className="rounded-2xl p-8 bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>DPP ISO 14040 & EU ESPR STANDARDS</span>
          </div>
          <h3 className="font-display font-bold text-xl text-white">
            Need custom enterprise or fleet integration?
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Integrate ReTrace API capabilities into OEM warranty portals, municipal repair hubs, or recycling networks.
          </p>
        </div>

        <Link
          to="/contact"
          className="px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs transition-colors shrink-0"
        >
          Contact Protocol Team
        </Link>
      </div>

    </div>
  );
};
