import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Repairer } from '../../types';
import { 
  Star, 
  ShieldCheck, 
  Wrench, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Magnetic } from '../motion/Magnetic';

export const TopRepairersShowcase: React.FC = () => {
  const { getTopRepairers } = useApp();
  const navigate = useNavigate();

  // Dynamically calculate the 3 to 5 highest-rated repairers from actual database ranking
  const topRepairers = getTopRepairers(5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-progress cinematic sequence unless hovered
  useEffect(() => {
    if (topRepairers.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % topRepairers.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [topRepairers.length, isPaused]);

  if (!topRepairers || topRepairers.length === 0) {
    return null;
  }

  const activeRepairer = topRepairers[currentIndex] || topRepairers[0];

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % topRepairers.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + topRepairers.length) % topRepairers.length);
  };

  const handleSelect = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  // Variants for center cinematic showcase with scale, blur, opacity, rotation, and spring physics
  const cardVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 120 : -120,
      scale: 0.88,
      opacity: 0,
      filter: 'blur(10px)',
      rotateY: dir > 0 ? 12 : -12,
    }),
    center: {
      x: 0,
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      rotateY: 0,
      transition: {
        x: { type: 'spring' as const, stiffness: 280, damping: 28 },
        scale: { type: 'spring' as const, stiffness: 280, damping: 28 },
        opacity: { duration: 0.4 },
        filter: { duration: 0.3 }
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -120 : 120,
      scale: 0.88,
      opacity: 0,
      filter: 'blur(10px)',
      rotateY: dir > 0 ? -12 : 12,
      transition: {
        duration: 0.35,
        ease: 'easeInOut' as const
      }
    })
  };

  return (
    <section 
      className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Section Header */}
      <div className="text-center space-y-2.5 max-w-2xl mx-auto mb-12 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-400/10 border border-amber-400/25 text-amber-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="uppercase font-semibold tracking-wider">Verified Network</span>
        </div>

        <h2 className="font-display font-bold text-2xl sm:text-3xl text-zinc-100 tracking-tight">
          Top Hardware Repairers
        </h2>

        <p className="text-zinc-400 text-sm font-normal">
          Trusted by ReTrace users. <span className="text-zinc-500 font-mono text-xs">Dynamically ranked by verified on-chain lifecycle repairs and authenticated ratings.</span>
        </p>
      </div>

      {/* Showcase Stage */}
      <div className="relative max-w-3xl mx-auto min-h-[380px] flex items-center justify-center">
        
        {/* Previous Preview Card (Subtle Background Offset) */}
        {topRepairers.length > 1 && (
          <div 
            onClick={handlePrev}
            className="hidden md:block absolute left-0 -translate-x-10 w-[260px] h-[280px] rounded-xl bg-zinc-900/60 border border-zinc-800/80 p-4 opacity-30 scale-[0.88] transition-all hover:opacity-60 cursor-pointer pointer-events-auto z-0"
          >
            {(() => {
              const prevIdx = (currentIndex - 1 + topRepairers.length) % topRepairers.length;
              const prevRep = topRepairers[prevIdx];
              return (
                <div className="h-full flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={prevRep.avatar || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200'} 
                      alt="" 
                      className="w-10 h-10 rounded-lg object-cover grayscale" 
                    />
                    <div className="min-w-0">
                      <h4 className="font-display font-semibold text-zinc-300 text-sm truncate">{prevRep.name}</h4>
                      <span className="font-mono text-xs text-amber-400">★ {prevRep.rating}</span>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-zinc-500 line-clamp-2">{prevRep.specialty}</div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Center Animated Active Repairer Card */}
        <div className="relative z-10 w-full max-w-2xl px-2">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={activeRepairer.id}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="rounded-xl bg-zinc-900 border border-zinc-800 p-6 sm:p-7 shadow-xl backdrop-blur-md transition-colors"
            >
              {/* Card Header: Rank, Shop Image, Shop Name, Verified Badge */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 pb-5 border-b border-zinc-800">
                
                {/* Shop Photo + Main Info */}
                <div className="flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={activeRepairer.avatar || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80'}
                      alt={activeRepairer.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border border-zinc-700 shadow-md"
                    />
                    {activeRepairer.verificationStatus === 'VERIFIED' ? (
                      <span className="absolute -bottom-2 -right-1 px-1.5 py-0.5 rounded bg-emerald-500 text-zinc-950 font-mono font-bold text-[9px] flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>VERIFIED</span>
                      </span>
                    ) : (
                      <span className="absolute -bottom-2 -right-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-[9px]">
                        PENDING
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                        RANK #{currentIndex + 1}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-zinc-500" />
                        <span>{activeRepairer.city || activeRepairer.location}</span>
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-xl sm:text-2xl text-zinc-100 tracking-tight pt-0.5">
                      {activeRepairer.name}
                    </h3>

                    <p className="font-mono text-xs text-amber-400 font-medium">
                      {activeRepairer.specialty}
                    </p>

                    <p className="text-zinc-500 font-mono text-[11px]">
                      Lead: {activeRepairer.ownerName || 'Master Specialist'} • {activeRepairer.experienceYears || 5} Years Bench Experience
                    </p>
                  </div>
                </div>

                {/* Score & Volume Box */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 p-3 rounded-lg bg-zinc-950/60 border border-zinc-800 flex-shrink-0">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-display font-bold text-xl text-zinc-100">
                      {activeRepairer.rating > 0 ? activeRepairer.rating.toFixed(1) : 'New'}
                    </span>
                  </div>

                  <div className="text-right font-mono text-[11px] text-zinc-400 space-y-0.5">
                    <div>
                      <strong className="text-zinc-200">{activeRepairer.reviewCount}</strong> reviews
                    </div>
                    <div>
                      <strong className="text-emerald-400">{activeRepairer.completedRepairs}</strong> verified repairs
                    </div>
                  </div>
                </div>
              </div>

              {/* Specializations & Services */}
              <div className="py-4 space-y-2.5">
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  Specialization & Certified Services
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(activeRepairer.specializations || ['Dell', 'HP', 'Lenovo', 'Apple']).map((spec) => (
                    <span 
                      key={spec}
                      className="px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-300 border border-zinc-700/80 text-xs font-mono font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                  {(activeRepairer.services || []).slice(0, 3).map((serv) => (
                    <span 
                      key={serv}
                      className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-mono"
                    >
                      {serv}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-zinc-400 font-mono leading-relaxed line-clamp-2">
                  &ldquo;{activeRepairer.description || 'Specialized in multi-layer diagnostics, thermal re-engineering, and component replacement with cryptographic passport updates.'}&rdquo;
                </p>
              </div>

              {/* Bottom Card Strip: Hours & Quick Actions */}
              <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{activeRepairer.openingHours || 'Mon–Sat: 10:00 AM – 8:00 PM'}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1" />
                  <span className="text-emerald-400 font-medium">{activeRepairer.availability || 'OPEN'}</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Link
                    to={`/repairers/${activeRepairer.id}`}
                    className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-mono text-xs font-medium border border-zinc-700 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Profile</span>
                    <ExternalLink className="w-3 h-3 text-zinc-400" />
                  </Link>

                  <Link
                    to={`/repairers?select=${activeRepairer.id}`}
                    className="w-full sm:w-auto px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Request Repair</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next Preview Card (Subtle Background Offset) */}
        {topRepairers.length > 1 && (
          <div 
            onClick={handleNext}
            className="hidden md:block absolute right-0 translate-x-10 w-[260px] h-[280px] rounded-xl bg-zinc-900/60 border border-zinc-800/80 p-4 opacity-30 scale-[0.88] transition-all hover:opacity-60 cursor-pointer pointer-events-auto z-0"
          >
            {(() => {
              const nextIdx = (currentIndex + 1) % topRepairers.length;
              const nextRep = topRepairers[nextIdx];
              return (
                <div className="h-full flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={nextRep.avatar || 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=200'} 
                      alt="" 
                      className="w-10 h-10 rounded-lg object-cover grayscale" 
                    />
                    <div className="min-w-0">
                      <h4 className="font-display font-semibold text-zinc-300 text-sm truncate">{nextRep.name}</h4>
                      <span className="font-mono text-xs text-amber-400">★ {nextRep.rating}</span>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-zinc-500 line-clamp-2">{nextRep.specialty}</div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Interactive Controls & Navigation */}
      <div className="flex items-center justify-center gap-3 mt-8 relative z-10">
        <button
          onClick={handlePrev}
          aria-label="Previous repairer"
          className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Dots Indicator with Shop Name Labels */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
          {topRepairers.map((r, idx) => (
            <button
              key={r.id}
              onClick={() => handleSelect(idx)}
              className={`transition-all rounded-full cursor-pointer ${
                currentIndex === idx
                  ? 'w-5 h-2 bg-amber-400'
                  : 'w-2 h-2 bg-zinc-700 hover:bg-zinc-500'
              }`}
              title={r.name}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          aria-label="Next repairer"
          className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Action Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10 pt-8 border-t border-zinc-800/80 relative z-10">
        <Link
          to="/repairers"
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Browse All Repairers</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <Link
          to="/repairer/register"
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Register Repair Shop</span>
        </Link>
      </div>
    </section>
  );
};
