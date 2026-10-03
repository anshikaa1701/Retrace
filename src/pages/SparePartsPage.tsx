import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SparePart } from '../types';
import { 
  Layers, 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  ExternalLink,
  Tag,
  Cpu
} from 'lucide-react';

export const SparePartsPage: React.FC = () => {
  const { spareParts } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'ORIGINAL' | 'COMPATIBLE'>('ALL');

  const categories = ['ALL', 'Cooling & Thermal', 'Thermal Interface', 'Batteries', 'Displays', 'Storage', 'Memory', 'Input Devices', 'Power & Ports', 'Cameras', 'Chassis & Hinges'];

  const filteredParts = spareParts.filter((part) => {
    if (categoryFilter !== 'ALL' && part.category !== categoryFilter) return false;
    if (typeFilter !== 'ALL' && part.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = part.name.toLowerCase().includes(q);
      const matchNum = part.partNumber.toLowerCase().includes(q);
      const matchModels = part.compatibleModels.some(m => m.toLowerCase().includes(q));
      if (!matchName && !matchNum && !matchModels) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-xs">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>Circular Hardware Inventory</span>
        </div>
        <h1 className="font-display font-semibold text-2xl sm:text-3xl text-zinc-100 tracking-tight">
          Compatible Spare Part Finder
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto">
          Source authentic OEM components and certified tier-1 replacements to extend device lifespan.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="rounded-xl p-4 bg-zinc-900 border border-zinc-800 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by part name, part #, or compatible laptop/phone model..."
              className="w-full pl-9 pr-3 py-1.5 bg-zinc-950/60 border border-zinc-800 rounded-md text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 font-mono"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="py-1.5 px-2.5 bg-zinc-950/60 border border-zinc-800 rounded-md text-xs font-mono text-zinc-300 focus:outline-none focus:border-zinc-600 cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="py-1.5 px-2.5 bg-zinc-950/60 border border-zinc-800 rounded-md text-xs font-mono text-zinc-300 focus:outline-none focus:border-zinc-600 cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="ORIGINAL">OEM Original</option>
              <option value="COMPATIBLE">Tier-1 Compatible</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-2 border-t border-zinc-800">
          <span>{filteredParts.length} verified components cataloged</span>
          <span className="text-[11px] text-zinc-500">
            * Simulated verified partner inventory.
          </span>
        </div>
      </div>

      {/* Parts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredParts.map((part) => (
          <div
            key={part.id}
            className="rounded-xl p-5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col justify-between group space-y-3"
          >
            <div>
              {/* Header row */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-mono text-xs font-semibold text-amber-400">
                  {part.partNumber}
                </span>

                <div className="flex items-center gap-1.5 font-mono text-[10px]">
                  <span
                    className={`px-2 py-0.5 rounded ${
                      part.type === 'ORIGINAL'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                    }`}
                  >
                    {part.type}
                  </span>
                  {part.verified && (
                    <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                      ✓ Verified Source
                    </span>
                  )}
                </div>
              </div>

              {/* Part Name */}
              <h3 className="font-display font-semibold text-sm text-zinc-100 group-hover:text-amber-400 transition-colors mb-1.5">
                {part.name}
              </h3>

              <div className="text-xs font-mono text-zinc-400 mb-2">
                <span className="text-zinc-500 block text-[10px] uppercase">Source Provider</span>
                <span className="text-zinc-300">{part.source}</span>
              </div>

              {/* Compatible Models */}
              <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 space-y-1 font-mono text-[11px] mb-2">
                <span className="text-zinc-500 uppercase text-[10px] block">
                  Tested Compatible Hardware:
                </span>
                <div className="text-zinc-300 leading-tight">
                  {part.compatibleModels.join(' • ')}
                </div>
              </div>
            </div>

            {/* Price & Stock Strip */}
            <div className="pt-2.5 border-t border-zinc-800 flex items-center justify-between font-mono">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block">Approx. Price</span>
                <span className="text-base font-bold text-zinc-100">
                  ₹{part.price.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="text-right">
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded block ${
                    part.availability === 'IN_STOCK'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : part.availability === 'LOW_STOCK'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {part.availability.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-zinc-500 block mt-0.5">
                  Warranty: {part.warrantyMonths} Mo.
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
