import React from 'react';
import { LifecycleStatus, VerificationLevel, ProductCondition } from '../../types';
import { ShieldCheck, CheckCircle2, FileText, AlertCircle, Sparkles } from 'lucide-react';

export const StatusBadge: React.FC<{ status: LifecycleStatus; size?: 'sm' | 'md' }> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs tracking-wider';

  switch (status) {
    case 'ACTIVE':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-mono uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Active
        </span>
      );
    case 'IN_REPAIR':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-mono uppercase bg-amber-500/10 border border-amber-500/30 text-amber-400 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          In Repair
        </span>
      );
    case 'RESOLD':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-mono uppercase bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 ${sizeClasses}`}>
          <Sparkles className="w-3 h-3 text-cyan-400" />
          Resold / 2nd Life
        </span>
      );
    case 'IN_RECOVERY':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-mono uppercase bg-purple-500/10 border border-purple-500/30 text-purple-400 ${sizeClasses}`}>
          <AlertCircle className="w-3 h-3 text-purple-400" />
          In Recovery
        </span>
      );
    case 'END_OF_LIFE':
    case 'RECYCLED':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-mono uppercase bg-zinc-500/10 border border-zinc-500/30 text-zinc-400 ${sizeClasses}`}>
          <CheckCircle2 className="w-3 h-3 text-zinc-400" />
          End of Life / Recycled
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1 rounded-full font-mono uppercase bg-zinc-800 text-zinc-400 ${sizeClasses}`}>
          {status}
        </span>
      );
  }
};

export const VerificationBadge: React.FC<{ level: VerificationLevel; size?: 'sm' | 'md' }> = ({ level, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  switch (level) {
    case 'DOCUMENT_VERIFIED':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md font-mono font-medium bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)] ${sizeClasses}`}>
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span>✓ DOCUMENT VERIFIED</span>
        </span>
      );
    case 'REPAIRER_VERIFIED':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md font-mono font-medium bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)] ${sizeClasses}`}>
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>✓ REPAIRER VERIFIED</span>
        </span>
      );
    case 'USER_REPORTED':
    default:
      return (
        <span className={`inline-flex items-center gap-1 rounded-md font-mono text-zinc-400 bg-zinc-800/80 border border-zinc-700/60 ${sizeClasses}`}>
          <span>USER REPORTED</span>
        </span>
      );
  }
};

export const ConditionBadge: React.FC<{ condition: ProductCondition }> = ({ condition }) => {
  switch (condition) {
    case 'EXCELLENT':
      return (
        <span className="px-2.5 py-1 text-xs font-mono font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          EXCELLENT CONDITION
        </span>
      );
    case 'GOOD':
      return (
        <span className="px-2.5 py-1 text-xs font-mono font-medium rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          GOOD CONDITION
        </span>
      );
    case 'FAIR':
      return (
        <span className="px-2.5 py-1 text-xs font-mono font-medium rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
          FAIR CONDITION
        </span>
      );
    case 'DAMAGED':
      return (
        <span className="px-2.5 py-1 text-xs font-mono font-medium rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
          DAMAGED
        </span>
      );
    case 'IRREPARABLE':
      return (
        <span className="px-2.5 py-1 text-xs font-mono font-medium rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
          IRREPARABLE
        </span>
      );
  }
};
