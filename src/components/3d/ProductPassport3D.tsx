import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ShieldCheck, Cpu, Wrench, RefreshCw, QrCode } from 'lucide-react';

interface ProductPassport3DProps {
  productId?: string;
  brand?: string;
  model?: string;
}

export const ProductPassport3D: React.FC<ProductPassport3DProps> = ({
  productId = 'RP-DL-72891',
  brand = 'Dell',
  model = 'Inspiron 15'
}) => {
  const cardGroupRef = useRef<THREE.Group | null>(null);

  useFrame((state, delta) => {
    if (!cardGroupRef.current) return;
    const time = state.clock.getElapsedTime();
    const pointer = state.pointer;

    // Gentle floating bob
    cardGroupRef.current.position.y = Math.sin(time * 1.2) * 0.08;

    // Cursor-reactive 3D tilt
    cardGroupRef.current.rotation.x = THREE.MathUtils.lerp(
      cardGroupRef.current.rotation.x,
      -pointer.y * 0.28,
      delta * 3
    );
    cardGroupRef.current.rotation.y = THREE.MathUtils.lerp(
      cardGroupRef.current.rotation.y,
      pointer.x * 0.35,
      delta * 3
    );
  });

  return (
    <group ref={cardGroupRef}>
      {/* 3D Glass Slate Backing */}
      <mesh>
        <boxGeometry args={[3.2, 4.4, 0.08]} />
        <meshPhysicalMaterial
          color="#0d0d16"
          metalness={0.8}
          roughness={0.2}
          clearcoat={1}
          transmission={0.4}
          opacity={0.92}
          transparent
        />
      </mesh>

      {/* Holographic Border Outline */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(3.2, 4.4, 0.08)]} />
        <lineBasicMaterial color="#06B6D4" transparent opacity={0.65} />
      </lineSegments>

      {/* Embedded High-Fidelity UI Card rendered in 3D Space */}
      <Html
        transform
        distanceFactor={3.6}
        position={[0, 0, 0.06]}
        className="pointer-events-auto select-none"
      >
        <div className="w-[320px] rounded-2xl bg-[#0c0c14]/90 border border-white/15 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.2)] backdrop-blur-xl text-white font-sans space-y-4">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
                DIGITAL PRODUCT PASSPORT
              </span>
              <h3 className="font-display font-bold text-lg text-white">
                {brand} {model}
              </h3>
            </div>
            <div className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          {/* ReTrace ID Badge */}
          <div className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-400">RETRACE ID:</span>
            <span className="text-xs font-mono font-bold text-amber-400">{productId}</span>
          </div>

          {/* Status & Attributes */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[10px] font-mono text-zinc-500 block">CONDITION</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Good Condition
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[10px] font-mono text-zinc-500 block">REPAIRABILITY</span>
              <span className="text-amber-400 font-bold mt-0.5 block">High (8.6/10)</span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[10px] font-mono text-zinc-500 block">PURCHASED</span>
              <span className="text-zinc-200 font-mono mt-0.5 block">12 Mar 2025</span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[10px] font-mono text-zinc-500 block">LAST SERVICE</span>
              <span className="text-zinc-200 font-mono mt-0.5 block">08 Aug 2026</span>
            </div>
          </div>

          {/* Value Estimation */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-amber-400/10 via-cyan-400/10 to-transparent border border-amber-400/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-amber-300 block">ESTIMATED RESALE</span>
              <span className="font-mono font-bold text-sm text-white">₹28,000–₹32,000</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-emerald-400 block">VERIFIED REPAIRS</span>
              <span className="font-mono font-bold text-sm text-white">2 Services</span>
            </div>
          </div>

          {/* Privacy Protection Notice */}
          <div className="text-[10px] font-mono text-zinc-500 flex items-center justify-between pt-1">
            <span>Verified Lifecycle Identity</span>
            <span className="text-emerald-400/80">Owner Privacy Protected ✓</span>
          </div>
        </div>
      </Html>
    </group>
  );
};
