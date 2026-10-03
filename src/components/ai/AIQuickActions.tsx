import React from 'react';
import { Sparkles, ArrowRight, Smartphone, Laptop, Battery, Zap, Monitor, Wifi, HelpCircle } from 'lucide-react';
import { Product } from '../../types';

interface AIQuickActionsProps {
  onSelectChip: (text: string) => void;
  selectedProduct?: Product | null;
  currentPath?: string;
}

const DEFAULT_CHIPS = [
  { label: 'Phone overheating', icon: Zap },
  { label: 'Laptop running slow', icon: Laptop },
  { label: 'Battery draining fast', icon: Battery },
  { label: 'Device won\'t charge', icon: Zap },
  { label: 'Screen problem', icon: Monitor },
  { label: 'Wi-Fi issue', icon: Wifi }
];

export const AIQuickActions: React.FC<AIQuickActionsProps> = ({ 
  onSelectChip, 
  selectedProduct, 
  currentPath = '' 
}) => {
  // Context-aware suggestions depending on route (Prompt Item 9)
  const getContextualPrompts = () => {
    const list: Array<{ label: string; query: string }> = [];

    if (currentPath.includes('/passport/')) {
      list.push({
        label: 'Ask about this product passport',
        query: selectedProduct 
          ? `Explain the current hardware status and verified maintenance timeline for my ${selectedProduct.brand} ${selectedProduct.model}.`
          : 'Can you analyze this device\'s digital passport and tell me what maintenance it might need?'
      });
      list.push({
        label: 'Analyze repair history',
        query: selectedProduct
          ? `How does the repair history of ${selectedProduct.brand} ${selectedProduct.model} affect its longevity and resale value?`
          : 'Does previous repair history affect device safety and performance?'
      });
    } else if (currentPath.includes('/repair-requests') || currentPath.includes('/repairer/')) {
      list.push({
        label: 'Explain this repair issue',
        query: 'What diagnostic steps are needed to verify if overheating is causing unexpected thermal shutdowns?'
      });
    } else if (currentPath.includes('/resale')) {
      list.push({
        label: 'Should I repair before selling?',
        query: selectedProduct
          ? `Should I repair my ${selectedProduct.brand} ${selectedProduct.model} before listing it on the circular resale marketplace?`
          : 'Is it economically better to repair a device before reselling it on ReTrace?'
      });
    } else if (currentPath.includes('/recovery')) {
      list.push({
        label: 'What should I do with this product?',
        query: 'How do I know if an irreparable device is suitable for parts harvesting or certified R2v3 smelting?'
      });
    }

    return list;
  };

  const contextualPrompts = getContextualPrompts();

  return (
    <div className="space-y-3 font-mono text-xs">
      {/* Contextual Suggestions based on current page */}
      {contextualPrompts.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
            CONTEXTUAL SUGGESTIONS
          </span>
          <div className="flex flex-col gap-1.5">
            {contextualPrompts.map((cp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectChip(cp.query)}
                className="w-full text-left p-2.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 font-medium text-xs flex items-center justify-between transition-colors cursor-pointer group"
              >
                <span>&ldquo;{cp.label}&rdquo;</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Standard Quick Troubleshooting Chips */}
      <div className="space-y-1.5">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
          COMMON TECHNICAL TOPICS
        </span>
        <div className="flex flex-wrap gap-1.5">
          {DEFAULT_CHIPS.map((chip, idx) => {
            const Icon = chip.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectChip(`My ${chip.label.toLowerCase()}. What could be wrong and what can I do next?`)}
                className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] hover:border-amber-400/40 text-zinc-300 hover:text-white border border-white/[0.08] text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Icon className="w-3 h-3 text-amber-400" />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
