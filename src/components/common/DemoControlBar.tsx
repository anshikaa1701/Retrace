import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  User, 
  Wrench, 
  Recycle, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DemoControlBar: React.FC = () => {
  const { currentUser, switchRole, resetDemoData, verifyRepair, repairRequests } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleStepJump = (step: number) => {
    switch (step) {
      case 1:
        switchRole('OWNER');
        navigate('/products/new');
        break;
      case 2:
        navigate('/scan?demo=RP-DL-72891');
        break;
      case 3:
        navigate('/passport/RP-DL-72891');
        break;
      case 4:
        navigate('/ai-assistant?code=RP-DL-72891&prompt=overheating');
        break;
      case 5:
        switchRole('REPAIRER');
        navigate('/repairer/dashboard');
        break;
      case 6: {
        const dellReq = repairRequests.find(r => r.productCode === 'RP-DL-72891');
        if (dellReq) {
          verifyRepair(dellReq.id, 'TechFix_Authorized_Thermal_Overhaul_INV-99812.pdf');
        }
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.2 },
          colors: ['#F59E0B', '#06B6D4', '#ffffff']
        });
        switchRole('OWNER');
        navigate('/passport/RP-DL-72891');
        break;
      }
      case 7:
        navigate('/resale');
        break;
      default:
        break;
    }
    setIsExpanded(false);
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo data back to default initial state?')) {
      resetDemoData();
      navigate('/');
      setIsExpanded(false);
    }
  };

  return (
    <>
      {/* Floating HUD Pill docked at bottom-left */}
      <aside aria-label="Demo Flow Controls" className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500 shadow-xl transition-colors font-mono text-xs cursor-pointer select-none"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-semibold text-zinc-200">Demo HUD</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">{currentUser.role}</span>
          <Sliders className="w-3 h-3 text-zinc-500 ml-0.5" />
        </button>
      </aside>

      {/* Floating Command Panel Modal */}
      {isExpanded && (
        <div className="fixed bottom-16 left-4 sm:left-6 z-50 w-96 max-w-[calc(100vw-2rem)] rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl p-4 font-sans text-xs">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 mb-3">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold text-zinc-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Interactive Walkthrough</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Role Switcher */}
          <div className="mb-4">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">
              ACTIVE DEMO ROLE (CLICK TO SWITCH & GO):
            </span>
            <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
              <button
                onClick={() => {
                  switchRole('OWNER');
                  navigate('/dashboard');
                  setIsExpanded(false);
                }}
                className={`p-2 rounded-lg flex items-center gap-1.5 transition-all border cursor-pointer ${
                  currentUser.role === 'OWNER'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                    : 'bg-surface-200 border-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                <User className="w-3 h-3 text-emerald-400" />
                <span>Owner (Avi)</span>
              </button>

              <button
                onClick={() => {
                  switchRole('REPAIRER');
                  navigate('/repairer/dashboard');
                  setIsExpanded(false);
                }}
                className={`p-2 rounded-lg flex items-center gap-1.5 transition-all border cursor-pointer ${
                  currentUser.role === 'REPAIRER'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                    : 'bg-surface-200 border-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                <Wrench className="w-3 h-3 text-cyan-400" />
                <span>Repairer (TechFix)</span>
              </button>

              <button
                onClick={() => {
                  switchRole('RECYCLER');
                  navigate('/recycler/dashboard');
                  setIsExpanded(false);
                }}
                className={`p-2 rounded-lg flex items-center gap-1.5 transition-all border cursor-pointer ${
                  currentUser.role === 'RECYCLER'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold'
                    : 'bg-surface-200 border-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                <Recycle className="w-3 h-3 text-purple-400" />
                <span>Recycler (GreenCycle)</span>
              </button>

              <button
                onClick={() => {
                  switchRole('ADMIN');
                  navigate('/admin');
                  setIsExpanded(false);
                }}
                className={`p-2 rounded-lg flex items-center gap-1.5 transition-all border cursor-pointer ${
                  currentUser.role === 'ADMIN'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                    : 'bg-surface-200 border-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* 1-Click Sequence Steps matching Section 39 */}
          <div className="space-y-1.5 mb-4">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
              DEMO SCRIPT FLOW:
            </span>

            <button
              onClick={() => handleStepJump(1)}
              className="w-full p-2 rounded-lg bg-surface-200 hover:bg-surface-100 border border-white/5 hover:border-amber-500/30 text-left font-mono text-xs flex items-center justify-between text-zinc-200 transition-colors cursor-pointer"
            >
              <span><strong className="text-amber-400">1.</strong> + Add Product (Manual Entry & Invoice)</span>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
            </button>

            <button
              onClick={() => handleStepJump(2)}
              className="w-full p-2 rounded-lg bg-surface-200 hover:bg-surface-100 border border-white/5 hover:border-amber-500/30 text-left font-mono text-xs flex items-center justify-between text-zinc-200 transition-colors cursor-pointer"
            >
              <span><strong className="text-amber-400">2.</strong> Scan ReTrace QR (RP-DL-72891)</span>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
            </button>

            <button
              onClick={() => handleStepJump(3)}
              className="w-full p-2 rounded-lg bg-surface-200 hover:bg-surface-100 border border-white/5 hover:border-amber-500/30 text-left font-mono text-xs flex items-center justify-between text-zinc-200 transition-colors cursor-pointer"
            >
              <span><strong className="text-amber-400">3.</strong> Open Dell Digital Passport</span>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
            </button>

            <button
              onClick={() => handleStepJump(4)}
              className="w-full p-2 rounded-lg bg-surface-200 hover:bg-surface-100 border border-white/5 hover:border-cyan-500/30 text-left font-mono text-xs flex items-center justify-between text-zinc-200 transition-colors cursor-pointer"
            >
              <span><strong className="text-cyan-400">4.</strong> Ask ReTrace AI: Overheating</span>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
            </button>

            <button
              onClick={() => handleStepJump(5)}
              className="w-full p-2 rounded-lg bg-surface-200 hover:bg-surface-100 border border-white/5 hover:border-cyan-500/30 text-left font-mono text-xs flex items-center justify-between text-zinc-200 transition-colors cursor-pointer"
            >
              <span><strong className="text-cyan-400">5.</strong> TechFix Portal (Accept Ticket)</span>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
            </button>

            <button
              onClick={() => handleStepJump(6)}
              className="w-full p-2.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-left font-mono text-xs font-semibold flex items-center justify-between text-emerald-300 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>6. Verify Repair On Passport</span>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            </button>

            <button
              onClick={() => handleStepJump(7)}
              className="w-full p-2 rounded-lg bg-surface-200 hover:bg-surface-100 border border-white/5 hover:border-purple-500/30 text-left font-mono text-xs flex items-center justify-between text-zinc-200 transition-colors cursor-pointer"
            >
              <span><strong className="text-purple-400">7.</strong> Circular Resale & Recovery</span>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
            </button>
          </div>

          {/* Reset Action */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between font-mono text-[11px]">
            <span className="text-zinc-500">Persistent State</span>
            <button
              onClick={handleReset}
              className="text-zinc-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset State</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
