import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Buttery spring physics for the cursor ring and ambient follower
  const springConfig = { damping: 28, stiffness: 250, mass: 0.2 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Even softer follower for ambient halo
  const haloConfig = { damping: 35, stiffness: 120, mass: 0.6 };
  const haloX = useSpring(mouseX, haloConfig);
  const haloY = useSpring(mouseY, haloConfig);

  useEffect(() => {
    // Check if touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const clickable = target.closest('button, a, input, select, textarea, [role="button"], .cursor-pointer');
      setIsHoveringClickable(!!clickable);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* 1. Large Soft Ambient Light Halo (warm amber / subtle golden-cyan) */}
      <motion.div
        style={{
          x: haloX,
          y: haloY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="w-[320px] h-[320px] rounded-full bg-radial from-amber-500/[0.045] via-yellow-500/[0.015] to-transparent blur-2xl"
      />

      {/* 2. Sleek Custom Cursor Dot with spring scaling */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHoveringClickable ? 2.2 : 1,
          opacity: 1
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="w-2.5 h-2.5 rounded-full bg-amber-400 mix-blend-difference shadow-[0_0_12px_rgba(251,191,36,0.6)]"
      />

      {/* 3. Subtle outer tracking ring on hover */}
      {isHoveringClickable && (
        <motion.div
          style={{
            x: smoothX,
            y: smoothY,
            translateX: '-50%',
            translateY: '-50%',
          }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="w-8 h-8 rounded-full border border-amber-400/50 pointer-events-none"
        />
      )}
    </div>
  );
};
