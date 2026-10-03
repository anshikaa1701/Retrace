import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  QrCode, 
  Activity, 
  HelpCircle, 
  Compass, 
  Repeat, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Wrench, 
  ShoppingBag, 
  Recycle,
  Cpu
} from 'lucide-react';

const STEPS = [
  {
    num: '01',
    title: 'CREATE YOUR PRODUCT PASSPORT',
    subtitle: 'Mint an immutable digital certificate',
    desc: 'Register any consumer electronics device with its brand, model, and serial number. ReTrace generates an authenticated cryptographic identifier (e.g. RP-DL-72891) and printable QR sticker.',
    icon: QrCode,
    badge: 'IDENTITY REGISTRATION',
    actionText: 'Register Device',
    actionLink: '/products/new'
  },
  {
    num: '02',
    title: 'TRACK ITS LIFECYCLE',
    subtitle: 'Transparent service & telemetry history',
    desc: 'Every diagnostic checkup, thermal paste refresh, battery cycle count, and parts replacement is timestamped to the device ledger. Buyers and owners see authentic hardware provenance.',
    icon: Activity,
    badge: 'TELEMETRY & PASSPORT',
    actionText: 'View Benchmark Passport',
    actionLink: '/passport/RP-DL-72891'
  },
  {
    num: '03',
    title: "UNDERSTAND WHAT'S WRONG",
    subtitle: 'AI diagnostic engine with Google Gemini',
    desc: 'Describe symptoms such as overheating, flickering display, or sudden battery drops. ReTrace AI correlates your product context with repair schematics to identify likely root causes safely.',
    icon: HelpCircle,
    badge: 'AI DIAGNOSTICS',
    actionText: 'Ask ReTrace AI',
    actionLink: '/ai-assistant'
  },
  {
    num: '04',
    title: 'FIND THE RIGHT NEXT PATH',
    subtitle: 'Objective circular recommendations',
    desc: 'Rather than jumping to replacement, ReTrace calculates whether repair is economically optimal, if the device should be resold while value is high, or if parts should be harvested.',
    icon: Compass,
    badge: 'PATHWAY OPTIMIZATION',
    actionText: 'Explore Pathways',
    actionLink: '/facilities'
  },
  {
    num: '05',
    title: 'REPAIR / RESELL / RECOVER / RECYCLE',
    subtitle: 'Closed-loop partner orchestration',
    desc: 'Seamlessly hand off your hardware to verified IPC-certified repairers, list on the verified resale marketplace, or courier directly to certified hydrometallurgical recycling refineries.',
    icon: Repeat,
    badge: 'ZERO LANDFILL RESOLUTION',
    actionText: 'Find Repairers',
    actionLink: '/repairers'
  }
];

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16 font-sans select-none">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>ARCHITECTURE & WORKFLOW</span>
        </div>

        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
          How ReTrace Works
        </h1>

        <p className="text-zinc-400 text-base leading-relaxed">
          From hardware birth to circular rebirth: a 5-step transparent pipeline that turns electronic waste into a circular resource.
        </p>
      </div>

      {/* Visual Step-by-Step Flow */}
      <div className="relative space-y-8">
        {/* Subtle connecting vertical timeline line */}
        <div className="hidden md:block absolute left-8 top-10 bottom-10 w-0.5 bg-gradient-to-b from-amber-400 via-emerald-400 to-amber-400 opacity-20 pointer-events-none" />

        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 p-6 sm:p-8 transition-all flex flex-col md:flex-row gap-6 items-start"
            >
              {/* Step Number & Icon Node */}
              <div className="flex md:flex-col items-center gap-3 shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-amber-400 shadow-md">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-mono font-bold text-xs px-2.5 py-1 rounded bg-zinc-800 text-amber-400 border border-zinc-700">
                  {step.num}
                </span>
              </div>

              {/* Step Content */}
              <div className="space-y-3 flex-1">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">
                    {step.badge}
                  </span>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-zinc-300">
                    {step.subtitle}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl font-sans">
                  {step.desc}
                </p>

                <div className="pt-2">
                  <Link
                    to={step.actionLink}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    <span>{step.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Callout */}
      <div className="rounded-2xl p-8 bg-zinc-950 border border-zinc-800 text-center space-y-4">
        <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
          Ready to register your device?
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
          Generate an immutable passport for your laptop, smartphone, or audio equipment in under 60 seconds.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            to="/products/new"
            className="px-6 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs transition-colors"
          >
            Create Product Passport
          </Link>
          <Link
            to="/scan"
            className="px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-medium text-xs transition-colors"
          >
            Scan Existing QR
          </Link>
        </div>
      </div>

    </div>
  );
};
