import React, { useEffect, useRef } from 'react';

export const InteractiveBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const normX = ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3);
      const normY = ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3);
      document.documentElement.style.setProperty('--mouse-norm-x', normX);
      document.documentElement.style.setProperty('--mouse-norm-y', normY);
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);

      if (containerRef.current) {
        containerRef.current.style.setProperty('--glow-x', `${e.clientX}px`);
        containerRef.current.style.setProperty('--glow-y', `${e.clientY}px`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#09090b]"
      style={{
        '--glow-x': '50%',
        '--glow-y': '30%'
      } as React.CSSProperties}
    >
      {/* Subtle Technical Dot Matrix (Linear / Vercel style) */}
      <div 
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Extremely subtle cursor ambient light */}
      <div 
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: 'radial-gradient(600px circle at var(--glow-x) var(--glow-y), rgba(245, 158, 11, 0.025), transparent 70%)'
        }}
      />
    </div>
  );
};

