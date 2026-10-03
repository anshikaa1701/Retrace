import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Sparkles, ArrowRight, ShieldCheck, Check, RefreshCw, Wrench, Layers, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ImmersiveAISection: React.FC = () => {
  const [typedSymptom, setTypedSymptom] = useState('');
  const fullText = "My laptop is overheating and shutting down.";
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedSymptom(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        setIsTypingDone(true);
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  const relationshipSteps = [
    { label: 'USER SYMPTOM', val: 'Thermal cutoff & fan whine', color: '#F59E0B' },
    { label: 'AI ANALYSIS', val: 'NLP heuristic classification', color: '#06B6D4' },
    { label: 'PRODUCT HISTORY', val: '2024 Dell Inspiron • Battery OK', color: '#8B5CF6' },
    { label: 'POSSIBLE CAUSE', val: 'Thermal paste dry / fan degraded', color: '#EF4444' },
    { label: 'REPAIRABILITY', val: 'HIGH (8.5/10) • Modular parts', color: '#10B981' },
    { label: 'NEXT PATH', val: 'VERIFIED REPAIR (TechFix)', color: '#F59E0B' }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12">
      
      {/* Top Heading */}
      <div className="text-center space-y-3">
        <span className="font-mono text-xs text-amber-400 uppercase tracking-[0.25em] block">
          AI LIFECYCLE INTELLIGENCE
        </span>
        <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight">
          What&apos;s wrong with your product?
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
          State your hardware symptoms. ReTrace correlates device history, schematic repairability, and real-time parts availability.
        </p>
      </div>

      {/* AI Assessment Panel */}
      <div className="rounded-xl p-6 sm:p-8 bg-zinc-900 border border-zinc-800 shadow-xl relative overflow-hidden space-y-6">
        
        {/* User Symptom Typed character-by-character */}
        <div className="border-b border-zinc-800 pb-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              USER SYMPTOM INPUT
            </span>
            <span className="text-zinc-500">TARGET: RP-DL-72891 (DELL INSPIRON 15)</span>
          </div>

          <div className="font-display font-medium text-xl sm:text-2xl text-white min-h-[36px]">
            &ldquo;{typedSymptom}&rdquo;
            {!isTypingDone && <span className="inline-block w-2 h-5 bg-amber-400 ml-1 animate-pulse align-middle" />}
          </div>
        </div>

        {/* RETRACE AI Assessment Grid */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-xs font-semibold text-zinc-300 tracking-wider uppercase">
              RETRACE AI DIAGNOSTIC
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* 1. POSSIBLE ISSUE */}
            <div className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-800 space-y-1.5">
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider block">
                POSSIBLE ISSUE
              </span>
              <div className="font-semibold text-base text-white">
                Thermal / Cooling
              </div>
              <p className="text-[11px] font-mono text-zinc-400 leading-relaxed">
                Fan RPM degradation or dried compound triggering safety shutdown.
              </p>
            </div>

            {/* 2. REPAIRABILITY */}
            <div className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-800 space-y-1.5">
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider block">
                REPAIRABILITY
              </span>
              <div className="font-semibold text-base text-emerald-400 flex items-center gap-1.5">
                <span>HIGH</span>
                <span className="text-xs font-mono text-emerald-400/80">(8.5 / 10)</span>
              </div>
              <p className="text-[11px] font-mono text-zinc-400 leading-relaxed">
                Standard Philips screws, modular heatsink, replaceable thermal pads.
              </p>
            </div>

            {/* 3. PARTS */}
            <div className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-800 space-y-1.5">
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider block">
                PARTS AVAILABILITY
              </span>
              <div className="font-semibold text-base text-amber-400 flex items-center gap-1.5">
                <span>IN STOCK</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <p className="text-[11px] font-mono text-zinc-400 leading-relaxed">
                Dell Heatsink Fan (DL-FAN-5510) in local verified hub.
              </p>
            </div>

            {/* 4. RECOMMENDED ACTION */}
            <div className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-800 space-y-1.5">
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider block">
                RECOMMENDED ACTION
              </span>
              <div className="font-semibold text-base text-zinc-100">
                Authorized Service
              </div>
              <p className="text-[11px] font-mono text-zinc-400 leading-relaxed">
                Book thermal overhaul at TechFix (1.5 km away).
              </p>
            </div>
          </div>
        </div>

        {/* AI VISUALIZATION: Dynamic Relational Graph */}
        <div className="pt-3 border-t border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-zinc-400 tracking-wider uppercase">
              DECISION PIPELINE
            </span>
            <span className="font-mono text-[10px] text-amber-400">
              CONFIDENCE: 96.4%
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {relationshipSteps.map((step, idx) => (
              <div
                key={step.label}
                className="relative p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: step.color }} />
                    <span className="text-[9px] font-mono text-zinc-400 font-semibold tracking-wider">
                      {step.label}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-200 leading-tight">
                    {step.val}
                  </div>
                </div>

                {idx < relationshipSteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 text-zinc-600 text-xs z-10">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>ESTIMATED SERVICE COST: ₹3,000 (SAVES ₹15,000 REPLACEMENT)</span>
          </div>

          <div className="flex items-center gap-2.5 font-mono text-xs">
            <Link
              to="/repairers"
              className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>FIND REPAIRER</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/parts"
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors cursor-pointer"
            >
              VIEW PARTS
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
