import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InteractiveWordProps {
  word: string;
  subtext?: string;
  accentColor?: string;
  className?: string;
  onClick?: () => void;
}

export const InteractiveWord: React.FC<InteractiveWordProps> = ({
  word,
  subtext,
  accentColor = '#10B981',
  className = '',
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      className={`relative inline-block cursor-pointer select-none group align-baseline ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <motion.span
        animate={{
          letterSpacing: isHovered ? '0.08em' : '0.01em',
          x: isHovered ? 3 : 0,
          color: isHovered ? '#ffffff' : 'inherit'
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="relative z-10 transition-colors inline-block"
      >
        {word}
      </motion.span>

      {/* Expanding Underline */}
      <motion.span
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0, opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{ originX: 0, backgroundColor: accentColor }}
        className="absolute left-0 bottom-0 w-full h-[1.5px] pointer-events-none"
      />

      {/* Floating Micro Reveal Tag */}
      <AnimatePresence>
        {isHovered && subtext && (
          <motion.span
            initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: -4, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 4, filter: 'blur(4px)' }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 -top-6 whitespace-nowrap font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded bg-[#16161e] border border-white/10 text-emerald-400 z-30 shadow-xl pointer-events-none"
          >
            {subtext}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
};
