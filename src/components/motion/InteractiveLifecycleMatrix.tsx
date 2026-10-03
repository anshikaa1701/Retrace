import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, ShoppingBag, Cpu, Recycle, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export type LifecyclePathKey = 'REPAIR' | 'RESELL' | 'RECOVER' | 'RECYCLE';

interface PathConfig {
  key: LifecyclePathKey;
  label: string;
  tagline: string;
  primaryStat: string;
  secondaryStat: string;
  detail: string;
  ctaText: string;
  ctaLink: string;
  color: string;
  icon: any;
}

const PATHS: Record<LifecyclePathKey, PathConfig> = {
  REPAIR: {
    key: 'REPAIR',
    label: 'REPAIR',
    tagline: 'Thermal & Component Restoration',
    primaryStat: 'Estimated cost ₹3,000',
    secondaryStat: 'Replacement cost ₹15,000',
    detail: 'Parts Available • Remaining life 2–3 years',
    ctaText: 'FIND REPAIRER',
    ctaLink: '/repairers?product=RP-DL-72891',
    color: '#F59E0B',
    icon: Wrench
  },
  RESELL: {
    key: 'RESELL',
    label: 'RESELL',
    tagline: 'Circular Marketplace Handover',
    primaryStat: '₹18,000–₹21,000',
    secondaryStat: 'Verified history attached',
    detail: 'Digital Passport mints automatic buyer trust',
    ctaText: 'CREATE LISTING',
    ctaLink: '/resale',
    color: '#06B6D4',
    icon: ShoppingBag
  },
  RECOVER: {
    key: 'RECOVER',
    label: 'RECOVER',
    tagline: 'Modular Component Harvest',
    primaryStat: 'Estimated recovery ₹2,000',
    secondaryStat: 'Pickup available',
    detail: 'Salvage RAM, display panel & SSD storage',
    ctaText: 'FIND PARTNER',
    ctaLink: '/recovery',
    color: '#A855F7',
    icon: Cpu
  },
  RECYCLE: {
    key: 'RECYCLE',
    label: 'RECYCLE',
    tagline: 'Zero-Landfill Circular Smelting',
    primaryStat: 'Verified e-waste partner',
    secondaryStat: 'R2v3 Certified Extraction',
    detail: 'Gold, silver, and copper recovery loop',
    ctaText: 'REQUEST COLLECTION',
    ctaLink: '/recovery',
    color: '#10B981',
    icon: Recycle
  }
};

export const InteractiveLifecycleMatrix: React.FC = () => {
  const [activePath, setActivePath] = useState<LifecyclePathKey>('REPAIR');

  const selected = PATHS[activePath];
  const Icon = selected.icon;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10">
      
      {/* 4 Interactive Paths with 3D Depth Transition */}
      <div 
        style={{ perspective: 1200 }} 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {(Object.keys(PATHS) as LifecyclePathKey[]).map((key, idx) => {
          const item = PATHS[key];
          const ItemIcon = item.icon;
          const isSelected = activePath === key;

          return (
            <motion.div
              key={key}
              onMouseEnter={() => setActivePath(key)}
              onClick={() => setActivePath(key)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              animate={{
                scale: isSelected ? 1.04 : 0.96,
                z: isSelected ? 30 : -20,
                opacity: isSelected ? 1 : 0.65
              }}
              className={`p-5 rounded-xl cursor-pointer border transition-all duration-200 relative overflow-hidden ${
                isSelected
                  ? 'bg-zinc-850 border-zinc-600 shadow-md'
                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
              }`}
              style={{
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Dynamic top edge glow */}
              {isSelected && (
                <div 
                  className="absolute top-0 inset-x-6 h-[2px] shadow-[0_0_15px_#F59E0B]"
                  style={{ backgroundColor: item.color }}
                />
              )}

              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center border transition-colors"
                  style={{
                    backgroundColor: isSelected ? `${item.color}20` : 'rgba(255,255,255,0.03)',
                    borderColor: isSelected ? `${item.color}50` : 'rgba(255,255,255,0.08)'
                  }}
                >
                  <ItemIcon
                    className="w-5 h-5 transition-colors"
                    style={{ color: isSelected ? item.color : '#71717A' }}
                  />
                </div>

                <span
                  className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full"
                  style={{
                    color: isSelected ? item.color : '#52525B',
                    backgroundColor: isSelected ? `${item.color}15` : 'transparent'
                  }}
                >
                  {isSelected ? 'DOMINANT' : 'PATH'}
                </span>
              </div>

              <h3 className="font-display font-black text-2xl text-white mb-1 tracking-tight">
                {item.label}
              </h3>
              <p className="text-xs text-zinc-400 font-mono mb-4">
                {item.tagline}
              </p>

              <div className="pt-3 border-t border-white/[0.06] font-mono text-[11px] space-y-1">
                <div className="text-white font-semibold">{item.primaryStat}</div>
                <div className="text-zinc-500">{item.secondaryStat}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Dominant Path Detail Expansion */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePath}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl p-6 sm:p-8 bg-zinc-900 border border-zinc-800 shadow-xl relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: selected.color }}
                />
                <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                  RECOMMENDED CIRCULAR ROUTE
                </span>
              </div>

              <h4 className="font-bold text-2xl sm:text-3xl text-white">
                {selected.label}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 font-mono text-xs">
                <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block uppercase mb-0.5">ESTIMATE / VALUE</span>
                  <span className="text-zinc-200 font-bold text-sm">{selected.primaryStat}</span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block uppercase mb-0.5">CONTEXT</span>
                  <span className="text-amber-400 font-medium text-sm">{selected.secondaryStat}</span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block uppercase mb-0.5">STATUS</span>
                  <span className="text-emerald-400 font-medium text-sm">{selected.detail}</span>
                </div>
              </div>
            </div>

            <Link
              to={selected.ctaLink}
              className="px-5 py-2.5 rounded-lg font-mono font-semibold text-xs tracking-wider flex items-center gap-2 transition-colors shadow-md self-start md:self-auto cursor-pointer"
              style={{
                backgroundColor: selected.color,
                color: '#080808'
              }}
            >
              <span>{selected.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
