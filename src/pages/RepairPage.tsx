import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Wrench, 
  MapPin, 
  Star, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Search
} from 'lucide-react';

export const RepairPage: React.FC = () => {
  const { repairers, repairRequests } = useApp();

  const topRepairers = repairers
    .filter(r => r.verificationStatus === 'VERIFIED')
    .slice(0, 3);

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16 font-sans select-none">
      
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
          <Wrench className="w-3.5 h-3.5 text-amber-400" />
          <span>VERIFIED HARDWARE SERVICE NETWORK</span>
        </div>

        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
          Repair Your Device with Confidence
        </h1>

        <p className="text-zinc-400 text-base leading-relaxed">
          Connect with certified independent workshops that diagnose problems accurately, use genuine replacement parts, and mint cryptographic maintenance logs to your product passport.
        </p>

        {/* Primary CTA */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/repairers"
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wider flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-amber-400/10"
          >
            <Wrench className="w-4 h-4" />
            <span>FIND A REPAIRER</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/repairer/register"
            className="px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-medium tracking-wide transition-colors"
          >
            <span>Register as a Repairer</span>
          </Link>
        </div>
      </div>

      {/* 4 Feature Columns: Find, Nearby, Top Rated, Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Find Repairer */}
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-amber-400">
              <Search className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-white">Find Repairer</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Search by device brand (Apple, Dell, Lenovo), component issue, or specific certification.
            </p>
          </div>
          <Link
            to="/repairers"
            className="text-xs font-semibold text-amber-400 hover:underline pt-2 block"
          >
            Search Directory →
          </Link>
        </div>

        {/* 2. Nearby Repairers */}
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-cyan-400">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-white">Nearby Repairers</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Locate authorized repair hubs within your metro area with live turnaround time estimates.
            </p>
          </div>
          <Link
            to="/repairers"
            className="text-xs font-semibold text-cyan-400 hover:underline pt-2 block"
          >
            View Map Hubs →
          </Link>
        </div>

        {/* 3. Top Rated Repairers */}
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-amber-400">
              <Star className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-white">Top Rated Repairers</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Audited by verified customer work orders and cryptographic service ledger consistency.
            </p>
          </div>
          <Link
            to="/repairers"
            className="text-xs font-semibold text-amber-400 hover:underline pt-2 block"
          >
            See Leaderboard →
          </Link>
        </div>

        {/* 4. Repair Status & Tracking */}
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-white">Repair Status</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Track open diagnostics, parts procurement, and final signoff directly from your dashboard.
            </p>
          </div>
          <Link
            to="/repair-requests"
            className="text-xs font-semibold text-emerald-400 hover:underline pt-2 block"
          >
            Track Work Orders →
          </Link>
        </div>

      </div>

      {/* Top Rated Showcase Preview */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
              Featured Verified Workshops
            </h2>
            <p className="text-xs text-zinc-400">
              High-volume repair centers with verified cryptographic logging.
            </p>
          </div>
          <Link
            to="/repairers"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>View all {repairers.length} shops</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {topRepairers.map((shop) => (
            <div
              key={shop.id}
              className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                  ✓ ReTrace Verified
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{shop.rating.toFixed(1)}</span>
                </div>
              </div>

              <div>
                <h4 className="font-display font-bold text-base text-white">
                  {shop.name}
                </h4>
                <p className="text-xs text-zinc-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{shop.location}</span>
                </p>
              </div>

              <div className="text-xs text-zinc-400 line-clamp-2">
                {shop.description}
              </div>

              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-400">
                  {shop.completedRepairs} Repairs Logged
                </span>
                <Link
                  to={`/repairers/${shop.id}`}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-medium transition-colors"
                >
                  View Shop
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
