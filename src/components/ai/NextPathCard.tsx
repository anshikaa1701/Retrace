import React from 'react';
import { NextPathOption } from '../../types';
import { Wrench, ShoppingBag, Recycle, Cpu, ArrowRight, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NextPathCardProps {
  paths: NextPathOption[];
  onSelectAction?: (path: NextPathOption) => void;
}

export const NextPathCard: React.FC<NextPathCardProps> = ({ paths, onSelectAction }) => {
  const navigate = useNavigate();

  const getPathIcon = (type: NextPathOption['type']) => {
    switch (type) {
      case 'REPAIR':
        return <Wrench className="w-5 h-5 text-emerald-400" />;
      case 'RESELL':
        return <ShoppingBag className="w-5 h-5 text-cyan-400" />;
      case 'RECOVER':
        return <Cpu className="w-5 h-5 text-purple-400" />;
      case 'RECYCLE':
        return <Recycle className="w-5 h-5 text-zinc-400" />;
    }
  };

  const getPathAccentColor = (type: NextPathOption['type']) => {
    switch (type) {
      case 'REPAIR':
        return 'border-emerald-500/30 hover:border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.08)]';
      case 'RESELL':
        return 'border-cyan-500/30 hover:border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.08)]';
      case 'RECOVER':
        return 'border-purple-500/30 hover:border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.08)]';
      case 'RECYCLE':
        return 'border-zinc-700 hover:border-zinc-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">
            CIRCULAR DECISION MATRIX
          </span>
          <h3 className="font-display font-bold text-xl text-white">
            ReTrace Analysis & Next Path Tradeoffs
          </h3>
        </div>
        <div className="text-xs font-mono text-zinc-400 bg-surface-200 px-3 py-1.5 rounded-lg border border-white/5">
          EVALUATING 4 CONVERGENT PATHS
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paths.map((path) => {
          return (
            <div
              key={path.type}
              className={`glass-card rounded-2xl p-6 border transition-all flex flex-col justify-between ${getPathAccentColor(
                path.type
              )}`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-surface-200 border border-white/10 flex items-center justify-center">
                      {getPathIcon(path.type)}
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-white tracking-widest uppercase">
                        {path.type}
                      </span>
                      <div className="text-[10px] font-mono text-zinc-400">
                        CONFIDENCE: {path.confidence}%
                      </div>
                    </div>
                  </div>

                  {path.recommended && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      RECOMMENDED
                    </span>
                  )}
                </div>

                {/* Title */}
                <h4 className="font-display font-semibold text-white text-base mb-3">
                  {path.title}
                </h4>

                {/* Financial / Lifetime Metric Box */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-surface-300/80 border border-white/5 font-mono text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">
                      {path.costEstimate ? 'EST. BENCH COST' : 'EST. VALUE RECOVERED'}
                    </span>
                    <span className="text-white font-bold text-sm">
                      {path.costEstimate || path.valueEstimate || 'Free / Scrap'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">
                      POTENTIAL EXTENSION
                    </span>
                    <span className="text-emerald-400 font-semibold">
                      {path.remainingLife || 'End-of-Life'}
                    </span>
                  </div>
                </div>

                {/* Pros & Cons Tradeoff Lists */}
                <div className="space-y-2 text-xs mb-6">
                  <div className="space-y-1">
                    {path.pros.map((pro, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-1.5 text-zinc-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="leading-tight">{pro}</span>
                      </div>
                    ))}
                  </div>

                  {path.cons && path.cons.length > 0 && (
                    <div className="pt-2 border-t border-white/5 space-y-1">
                      {path.cons.map((con, cIdx) => (
                        <div key={cIdx} className="flex items-start gap-1.5 text-zinc-400 text-[11px]">
                          <span className="text-zinc-600 font-mono flex-shrink-0">•</span>
                          <span className="leading-tight">{con}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  if (onSelectAction) {
                    onSelectAction(path);
                  } else {
                    navigate(path.actionRoute);
                  }
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-surface-200 hover:bg-surface-100 border border-white/10 hover:border-white/25 text-white font-mono text-xs font-medium flex items-center justify-between transition-all group"
              >
                <span>{path.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
