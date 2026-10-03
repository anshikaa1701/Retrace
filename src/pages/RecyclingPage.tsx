import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Recycle, 
  Cpu, 
  ShieldCheck, 
  ArrowDown, 
  ArrowRight, 
  Layers, 
  FlaskConical, 
  Factory, 
  Leaf, 
  CheckCircle2 
} from 'lucide-react';

const RECYCLING_CASCADE = [
  {
    stage: 'PRODUCT',
    title: 'Irreparable Physical Device',
    desc: 'When motherboards suffer irreversible short circuits or chassis damage makes repair economically unfeasible, devices enter certified collection pathways.',
    icon: Cpu,
    materialHighlight: 'End-of-life electronics intake'
  },
  {
    stage: 'COMPONENTS',
    title: 'Precision Disassembly & Harvesting',
    desc: 'Trained technicians extract still-functional subcomponents: unexhausted lithium cells, socketed RAM modules, heatsinks, daughterboards, and camera modules.',
    icon: Layers,
    materialHighlight: 'Modular reuse for secondary repairs'
  },
  {
    stage: 'MATERIALS',
    title: 'Mechanical Shredding & Separation',
    desc: 'Non-reusable carcasses undergo optical sorting, magnetic eddy-current separation, and density classification to isolate metals and polymers.',
    icon: FlaskConical,
    materialHighlight: 'High-purity aluminum, copper & ABS plastics'
  },
  {
    stage: 'RECOVERY',
    title: 'Hydrometallurgical Refining',
    desc: 'Partner refineries process PCB traces using hydrometallurgical leaching instead of toxic open-pit burning, extracting gold, palladium, and rare-earth elements.',
    icon: Factory,
    materialHighlight: '99.6% purity gold & silver recovery'
  },
  {
    stage: 'NEW USE',
    title: 'Secondary Foundry Ingot Production',
    desc: 'Recovered metals re-enter the industrial supply chain as raw ingots for automotive, energy storage, and next-generation electronics manufacturing.',
    icon: Leaf,
    materialHighlight: 'Zero landfill footprint circular loop'
  }
];

export const RecyclingPage: React.FC = () => {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16 font-sans select-none">
      
      {/* Educational Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
          <Recycle className="w-3.5 h-3.5" />
          <span>ZERO-LANDFILL RECYCLING EDUCATION</span>
        </div>

        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
          The Circular Recycling Loop
        </h1>

        <p className="text-zinc-400 text-base leading-relaxed">
          How ReTrace coordinates with certified industrial recyclers and R2v3 refineries to ensure every gram of precious metal finds useful re-entry into the manufacturing stream.
        </p>
      </div>

      {/* Hero Statement */}
      <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 text-center space-y-4 shadow-2xl">
        <span className="font-mono text-xs text-amber-400 uppercase tracking-widest block">
          CENTRAL PROTOCOL TENET
        </span>
        <h2 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
          &ldquo;THE PRODUCT MAY END. <br />
          <span className="text-amber-400">THE MATERIAL DOESN&apos;T HAVE TO.&rdquo;</span>
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed pt-2">
          ReTrace provides the software ledger that verifies chain of custody from user collection to certified refinery signoff, preventing toxic e-waste exports.
        </p>
      </div>

      {/* The Visual Cascade Flow: PRODUCT ↓ COMPONENTS ↓ MATERIALS ↓ RECOVERY ↓ NEW USE */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
            Material Cascade Flow
          </h3>
          <p className="text-xs text-zinc-400">
            Click through each phase of closed-loop hardware recovery.
          </p>
        </div>

        <div className="space-y-3">
          {RECYCLING_CASCADE.map((step, idx) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={step.stage}>
                <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-amber-400 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                          {step.stage}
                        </span>
                        <h4 className="font-display font-bold text-base sm:text-lg text-white">
                          {step.title}
                        </h4>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-zinc-400 px-3 py-1 rounded bg-zinc-950 border border-zinc-800 shrink-0">
                    {step.materialHighlight}
                  </span>
                </div>

                {idx < RECYCLING_CASCADE.length - 1 && (
                  <div className="flex justify-center py-1">
                    <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Certification Standards Transparency Notice */}
      <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
        <div className="flex items-center gap-2.5 text-emerald-400">
          <ShieldCheck className="w-5 h-5" />
          <h4 className="font-display font-semibold text-base text-zinc-100">
            Factual Operations & Partner Compliance
          </h4>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
          ReTrace does not operate physical smelters or hazardous waste sites directly. Instead, ReTrace operates as the <strong>software ledger and dispatch network</strong> that connects device holders with certified, audited downstream recycling partners operating under <strong>R2v3</strong> (Responsible Recycling) and <strong>e-Stewards</strong> certifications.
        </p>

        <div className="pt-2 flex flex-wrap gap-4">
          <Link
            to="/recovery"
            className="px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs transition-colors"
          >
            Initiate Hardware Recovery
          </Link>
          <Link
            to="/recycler/dashboard"
            className="px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-medium transition-colors"
          >
            Recycler Partner Portal
          </Link>
        </div>
      </div>

    </div>
  );
};
