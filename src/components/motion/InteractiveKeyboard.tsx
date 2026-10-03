import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

interface KeyConfig {
  id: string;
  label: string;
  width?: string;
  isSpecial?: boolean;
}

const KEYBOARD_ROWS: KeyConfig[][] = [
  // Row 1: Numbers
  [
    { id: '`', label: '~' },
    { id: '1', label: '1' },
    { id: '2', label: '2' },
    { id: '3', label: '3' },
    { id: '4', label: '4' },
    { id: '5', label: '5' },
    { id: '6', label: '6' },
    { id: '7', label: '7' },
    { id: '8', label: '8' },
    { id: '9', label: '9' },
    { id: '0', label: '0' },
    { id: '-', label: '-' },
    { id: '=', label: '+' },
    { id: 'BACKSPACE', label: 'DELETE', width: 'w-16 sm:w-20', isSpecial: true }
  ],
  // Row 2: QWERTY
  [
    { id: 'TAB', label: 'TAB', width: 'w-14 sm:w-16', isSpecial: true },
    { id: 'Q', label: 'Q' },
    { id: 'W', label: 'W' },
    { id: 'E', label: 'E' },
    { id: 'R', label: 'R' },
    { id: 'T', label: 'T' },
    { id: 'Y', label: 'Y' },
    { id: 'U', label: 'U' },
    { id: 'I', label: 'I' },
    { id: 'O', label: 'O' },
    { id: 'P', label: 'P' },
    { id: '[', label: '[' },
    { id: ']', label: ']' },
    { id: '\\', label: '|', width: 'w-10 sm:w-12', isSpecial: true }
  ],
  // Row 3: ASDF
  [
    { id: 'CAPS', label: 'CAPS', width: 'w-16 sm:w-20', isSpecial: true },
    { id: 'A', label: 'A' },
    { id: 'S', label: 'S' },
    { id: 'D', label: 'D' },
    { id: 'F', label: 'F' },
    { id: 'G', label: 'G' },
    { id: 'H', label: 'H' },
    { id: 'J', label: 'J' },
    { id: 'K', label: 'K' },
    { id: 'L', label: 'L' },
    { id: ';', label: ':' },
    { id: "'", label: '"' },
    { id: 'ENTER', label: 'RETURN', width: 'w-16 sm:w-20', isSpecial: true }
  ],
  // Row 4: ZXCV
  [
    { id: 'SHIFT_L', label: 'SHIFT', width: 'w-20 sm:w-24', isSpecial: true },
    { id: 'Z', label: 'Z' },
    { id: 'X', label: 'X' },
    { id: 'C', label: 'C' },
    { id: 'V', label: 'V' },
    { id: 'B', label: 'B' },
    { id: 'N', label: 'N' },
    { id: 'M', label: 'M' },
    { id: ',', label: '<' },
    { id: '.', label: '>' },
    { id: '/', label: '?' },
    { id: 'SHIFT_R', label: 'SHIFT', width: 'w-20 sm:w-24', isSpecial: true }
  ],
  // Row 5: Spacebar & Modifiers
  [
    { id: 'CTRL', label: 'CTRL', width: 'w-12 sm:w-14', isSpecial: true },
    { id: 'OPT', label: 'OPT', width: 'w-12 sm:w-14', isSpecial: true },
    { id: 'CMD_L', label: 'CMD', width: 'w-14 sm:w-16', isSpecial: true },
    { id: 'SPACE', label: 'NEXT PATH', width: 'flex-1 max-w-sm', isSpecial: false },
    { id: 'CMD_R', label: 'CMD', width: 'w-14 sm:w-16', isSpecial: true },
    { id: 'OPT_R', label: 'OPT', width: 'w-12 sm:w-14', isSpecial: true }
  ]
];

const WORDS_SEQUENCE = [
  { word: 'REPAIR', sub: 'Restore Hardware Utility & Thermal Balance', color: '#10B981' },
  { word: 'RESELL', sub: 'Circular Marketplace Handover with Digital Passport', color: '#06B6D4' },
  { word: 'RECOVER', sub: 'Modular Component & Precious Material Salvage', color: '#A855F7' },
  { word: 'RECYCLE', sub: 'Zero-Landfill Hydrometallurgical Smelting', color: '#14B8A6' },
  { word: 'NEXT PATH', sub: 'Give Every Product a Verifiable Future', color: '#F59E0B' }
];

export const InteractiveKeyboard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Active highlighted key on the keyboard
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typedBuffer, setTypedBuffer] = useState('');
  const [manualTypedText, setManualTypedText] = useState('');

  // 3D Tilt based on mouse
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 180, mass: 0.3 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [26, 18]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-4, 4]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Automated Typing Sequence
  useEffect(() => {
    let letterIndex = 0;
    let wordIndex = 0;
    let isDeleting = false;
    let timeoutId: any;

    const typeLoop = () => {
      const targetObj = WORDS_SEQUENCE[wordIndex];
      const targetWord = targetObj.word;

      if (!isDeleting) {
        if (letterIndex < targetWord.length) {
          const char = targetWord[letterIndex].toUpperCase();
          const keyId = char === ' ' ? 'SPACE' : char;
          setActiveKey(keyId);
          letterIndex++;
          setTypedBuffer(targetWord.slice(0, letterIndex));
          timeoutId = setTimeout(() => {
            setActiveKey(null);
            timeoutId = setTimeout(typeLoop, 160);
          }, 110);
        } else {
          // Finished typing word; pause to let user view
          setCurrentWordIndex(wordIndex);
          timeoutId = setTimeout(() => {
            isDeleting = true;
            typeLoop();
          }, 1800);
        }
      } else {
        if (letterIndex > 0) {
          letterIndex--;
          setActiveKey('BACKSPACE');
          setTypedBuffer(targetWord.slice(0, letterIndex));
          timeoutId = setTimeout(() => {
            setActiveKey(null);
            timeoutId = setTimeout(typeLoop, 70);
          }, 50);
        } else {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % WORDS_SEQUENCE.length;
          setCurrentWordIndex(wordIndex);
          timeoutId = setTimeout(typeLoop, 400);
        }
      }
    };

    timeoutId = setTimeout(typeLoop, 1200);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleKeyClick = (key: KeyConfig) => {
    setActiveKey(key.id);
    setTimeout(() => setActiveKey(null), 180);
    if (key.id === 'BACKSPACE') {
      setManualTypedText((prev) => prev.slice(0, -1));
    } else if (key.id === 'SPACE') {
      setManualTypedText((prev) => prev + ' ');
    } else if (!key.isSpecial) {
      setManualTypedText((prev) => (prev + key.label).slice(-20));
    }
  };

  const currentTheme = WORDS_SEQUENCE[currentWordIndex];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-6xl mx-auto py-16 px-2 sm:px-4 flex flex-col items-center select-none"
    >
      {/* TYPOGRAPHY ABOVE KEYBOARD */}
      <div className="text-center space-y-3 mb-10 w-full">
        <span className="font-mono text-xs text-amber-400 tracking-wider uppercase block">
          PHYSICAL SIMULATION MODULE
        </span>

        <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
          What Happens <span className="text-zinc-500">Next?</span>
        </h2>

        {/* Dynamic Typed Word Indicator */}
        <div className="h-14 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={typedBuffer || currentTheme.word}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center"
            >
              <div
                className="font-display font-bold text-2xl sm:text-4xl tracking-wider uppercase transition-colors"
                style={{ color: currentTheme.color }}
              >
                {typedBuffer || currentTheme.word}
                <span className="inline-block w-1.5 h-6 bg-amber-400 ml-1.5 animate-pulse align-middle" />
              </div>

              <span className="font-mono text-xs text-zinc-400 mt-1 max-w-md text-center">
                {currentTheme.sub}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {manualTypedText && (
          <div className="font-mono text-[11px] text-zinc-500">
            MANUAL INPUT: <span className="text-amber-400">{manualTypedText}</span>
          </div>
        )}
      </div>

      {/* THE PHYSICAL KEYBOARD */}
      <div style={{ perspective: 1400 }} className="w-full flex justify-center overflow-x-auto pb-4">
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d'
          }}
          initial={{ y: 40, opacity: 0, rotateX: 20 }}
          whileInView={{ y: 0, opacity: 1, rotateX: 14 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative p-3.5 sm:p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl space-y-2 sm:space-y-2.5 min-w-[640px] max-w-5xl"
        >
          {KEYBOARD_ROWS.map((row, rowIdx) => (
            <div key={rowIdx} className="flex items-center justify-center gap-1.5 sm:gap-2">
              {row.map((key) => {
                const isCurrentlyActive = activeKey === key.id;
                const isSpace = key.id === 'SPACE';

                return (
                  <motion.button
                    key={key.id}
                    onClick={() => handleKeyClick(key)}
                    whileHover={{
                      y: -1
                    }}
                    animate={{
                      y: isCurrentlyActive ? 3 : 0,
                      scale: isCurrentlyActive ? 0.97 : 1,
                      backgroundColor: isCurrentlyActive ? '#27272a' : '#09090b',
                      borderColor: isCurrentlyActive ? '#f59e0b' : '#27272a'
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                    className={`h-10 sm:h-12 rounded-lg border flex flex-col items-center justify-center relative cursor-pointer transition-colors ${
                      key.width || 'w-10 sm:w-12'
                    } ${isSpace ? 'px-6' : ''}`}
                    style={{
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {/* Top Key Surface Letter Legend */}
                    <span
                      className={`font-mono transition-colors ${
                        isSpace
                          ? 'text-[11px] sm:text-xs font-bold tracking-[0.2em]'
                          : key.isSpecial
                          ? 'text-[9px] sm:text-[10px] font-semibold text-zinc-500'
                          : 'text-xs sm:text-sm font-bold text-zinc-200'
                      }`}
                      style={{
                        color: isCurrentlyActive ? '#F59E0B' : undefined
                      }}
                    >
                      {key.label}
                    </span>

                    {/* Active Key Glow Dot */}
                    {isCurrentlyActive && (
                      <span className="absolute bottom-1 w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          ))}

          {/* Chamfered Keyboard Chin & Logo */}
          <div className="pt-2 flex items-center justify-between px-3 text-[10px] font-mono text-zinc-600 border-t border-white/[0.05]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>RETRACE HARDWARE BUS • PROTOCOL v2.8</span>
            </span>
            <span className="hidden sm:inline">CLICK KEYS OR TYPE TO INTERACT</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
