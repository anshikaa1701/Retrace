import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Product } from '../../types';
import { QrCode, ShieldCheck, ArrowRight, CheckCircle2, Calendar, Wrench, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TiltPassportCardProps {
  product?: Product;
}

export const TiltPassportCard: React.FC<TiltPassportCardProps> = ({ product }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for 3D tilt (3-5 degrees maximum)
  const springConfig = { damping: 25, stiffness: 180, mass: 0.3 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [4.5, -4.5]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-4.5, 4.5]);
  const glareX = useTransform(smoothX, [-0.5, 0.5], ['10%', '90%']);
  const glareY = useTransform(smoothY, [-0.5, 0.5], ['10%', '90%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Demo Product Data matching user's exact benchmark
  const passportData = {
    brand: product?.brand || 'DELL',
    model: product?.model || 'INSPIRON 15',
    id: product?.productId || 'RP-DL-72891',
    condition: 'GOOD CONDITION',
    verifiedRepairs: '2 VERIFIED REPAIRS',
    purchased: '2024',
    lastService: '12 SEP 2026',
    repairability: 'HIGH',
    resale: '₹18,000–₹21,000'
  };

  const timelineSteps = [
    { year: '2024', label: 'PRODUCT REGISTERED', sub: 'Initial purchase & digital identity minting' },
    { year: '2025', label: 'BATTERY REPLACED', sub: 'Original OEM Battery swap by TechFix' },
    { year: '2026', label: 'MAINTENANCE', sub: 'Thermal overhaul & cooling purge' },
    { year: 'CURRENT', label: 'GOOD CONDITION', sub: 'Ready for extended lifecycle / resale' }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      
      {/* 3D Floating Digital Passport Card */}
      <div style={{ perspective: 1200 }} className="lg:col-span-7 flex justify-center">
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d'
          }}
          className="relative w-full max-w-md rounded-xl p-6 bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden cursor-pointer group"
        >
          {/* Cursor Specular Glare */}
          <motion.div
            style={{
              background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255, 255, 255, 0.04) 0%, transparent 60%)`
            }}
            className="absolute inset-0 pointer-events-none rounded-xl z-20"
          />

          {/* Interior 3D Passport Layers */}
          <div style={{ transform: 'translateZ(25px)' }} className="space-y-5 relative z-10">
            
            {/* Header / ID */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                  VERIFIED PASSPORT
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono text-[10px] font-semibold">
                {passportData.id}
              </span>
            </div>

            {/* Product Identity */}
            <div>
              <span className="font-mono text-xs text-zinc-500 tracking-wider block mb-0.5">
                {passportData.brand}
              </span>
              <h3 className="font-display font-bold text-2xl text-white tracking-tight">
                {passportData.model}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  {passportData.condition}
                </span>
                <span className="text-xs font-mono font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                  {passportData.verifiedRepairs}
                </span>
              </div>
            </div>

            {/* Structured Specifications Grid */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg bg-zinc-950/60 border border-zinc-800 font-mono text-xs">
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase">PURCHASED</span>
                <span className="text-zinc-200 font-medium">{passportData.purchased}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase">LAST SERVICE</span>
                <span className="text-zinc-200 font-medium">{passportData.lastService}</span>
              </div>
              <div className="pt-2 border-t border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 block uppercase">REPAIRABILITY</span>
                <span className="text-emerald-400 font-semibold">{passportData.repairability}</span>
              </div>
              <div className="pt-2 border-t border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 block uppercase">EST. RESALE</span>
                <span className="text-amber-400 font-semibold">{passportData.resale}</span>
              </div>
            </div>

            {/* Live Working QR Code section */}
            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded bg-white p-1 shadow-sm">
                  {/* Clean SVG QR Code */}
                  <svg className="w-9 h-9 text-black" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h4v2h-4v-2zm-4 0h2v4h-2v-4zm2 4h2v4h-2v-4zm2 2h2v2h-2v-2zm0-4h2v2h-2v-2zm-6 2h2v2h-2v-2zm4-8h2v2h-2V8zm-2 2h2v2h-2v-2zm-2-2h2v2h-2V8zm0 4h2v2h-2v-2z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 block">
                    IDENTITY RESOLUTION
                  </span>
                  <span className="text-[11px] font-mono text-zinc-300 font-medium">
                    retrace.id/p/{passportData.id}
                  </span>
                </div>
              </div>

              <Link
                to={`/passport/${passportData.id}`}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
                title="Open Passport"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Passport Timeline Section */}
      <div className="lg:col-span-5 space-y-6">
        <div>
          <span className="font-mono text-xs text-amber-400 uppercase tracking-widest block mb-1">
            IMMUTABLE VERIFIED TIMELINE
          </span>
          <h4 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Every Chapter Recorded.
          </h4>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            As parts are repaired or serviced, each milestone anchors permanently to the product's cryptographic history.
          </p>
        </div>

        {/* Animated Timeline List */}
        <div className="relative pl-6 space-y-6 border-l border-white/[0.1]">
          {timelineSteps.map((step, idx) => (
            <motion.div
              key={step.year}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              className="relative space-y-1 group"
            >
              {/* Timeline Node Dot */}
              <div className="absolute -left-[30px] top-1 w-3 h-3 rounded-full bg-zinc-950 border-2 border-amber-400 transition-transform" />
              
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-amber-400">{step.year}</span>
                <span className="text-white font-mono text-xs font-semibold">{step.label}</span>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                {step.sub}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="pt-2">
          <Link
            to={`/passport/${passportData.id}`}
            className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 hover:text-amber-300 group"
          >
            <span>VIEW FULL CRYPTOGRAPHIC LEDGER</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
