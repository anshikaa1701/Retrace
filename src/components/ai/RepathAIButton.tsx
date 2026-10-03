import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Sparkles, X, MessageSquare } from 'lucide-react';
import { RepathAIChat } from './RepathAIChat';

export const RepathAIButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showFirstVisitLabel, setShowFirstVisitLabel] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem('repath_ai_first_visit_seen');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setShowFirstVisitLabel(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissFirstVisitLabel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowFirstVisitLabel(false);
    localStorage.setItem('repath_ai_first_visit_seen', 'true');
  };

  const handleOpenAssistant = () => {
    setIsOpen(true);
    if (showFirstVisitLabel) {
      setShowFirstVisitLabel(false);
      localStorage.setItem('repath_ai_first_visit_seen', 'true');
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 pointer-events-auto">
          {/* First-visit invitation label */}
          {showFirstVisitLabel && (
            <div 
              onClick={handleOpenAssistant}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 shadow-xl cursor-pointer hover:border-zinc-500 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-zinc-200">
                Ask ReTrace AI
              </span>
              <button
                type="button"
                onClick={dismissFirstVisitLabel}
                className="p-0.5 rounded text-zinc-400 hover:text-zinc-200"
                title="Dismiss"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Clean SaaS Assistant Button */}
          <button
            type="button"
            onClick={handleOpenAssistant}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-850 border border-zinc-700 hover:border-zinc-500 text-zinc-100 shadow-xl transition-colors cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-amber-400/40"
            aria-label="Open ReTrace AI Technical Assistant"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-medium">ReTrace AI</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </button>
        </div>
      )}

      {/* Clean Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <RepathAIChat
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onMinimize={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};
