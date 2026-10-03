import React, { useState, useEffect, ReactNode, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';

interface Canvas3DWrapperProps {
  children: ReactNode;
  className?: string;
  fallback?: ReactNode;
  camera?: {
    position?: [number, number, number];
    fov?: number;
    near?: number;
    far?: number;
  };
}

export const Canvas3DWrapper: React.FC<Canvas3DWrapperProps> = ({
  children,
  className = 'w-full h-full',
  fallback,
  camera = { position: [0, 0, 7], fov: 45, near: 0.1, far: 100 }
}) => {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    motionQuery.addEventListener('change', handleMotionChange);

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setHasWebGL(Boolean(gl));
    } catch {
      setHasWebGL(false);
    }

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // While checking WebGL, render empty transparent container to prevent layout shift
  if (hasWebGL === null) {
    return <div className={`relative overflow-hidden ${className}`} />;
  }

  // If WebGL is not supported or user prefers reduced motion, render fallback
  if (!hasWebGL || prefersReducedMotion) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className={`relative overflow-hidden flex items-center justify-center ${className}`}>
        {/* Subtle 2D procedural gradient & particle fallback */}
        <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 via-emerald-500/5 to-transparent pointer-events-none" />
        <div className="relative z-10 text-center p-6 space-y-2 max-w-sm font-mono text-xs text-zinc-500">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 mx-auto animate-pulse" />
          <p className="text-zinc-300 font-semibold tracking-wider uppercase">RETRACE COMPUTATIONAL CORE</p>
          <p className="text-[11px] text-zinc-500">Optimized 2D Mode active for device performance.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Canvas
        camera={camera}
        dpr={[1, Math.min(window.devicePixelRatio || 1, 1.75)]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
};
