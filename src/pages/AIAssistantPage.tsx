import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AIChat } from '../components/ai/AIChat';
import { Cpu, Sparkles, ShieldCheck } from 'lucide-react';

export const AIAssistantPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { getProduct } = useApp();

  const codeParam = searchParams.get('code');
  const promptParam = searchParams.get('prompt');

  const initialProduct = codeParam ? getProduct(codeParam) : undefined;
  const initialPrompt = promptParam === 'overheating' ? 'My laptop is overheating and shutting down.' : promptParam || undefined;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 font-sans">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>NEURAL HARDWARE DIAGNOSTICS</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
          What should happen next?
        </h1>
        <p className="text-zinc-400 text-sm max-w-lg mx-auto">
          ReTrace evaluates your device&apos;s exact hardware model, previous service history, and symptoms to recommend the optimal circular path.
        </p>
      </div>

      {/* AIChat Interface Component */}
      <AIChat initialProduct={initialProduct} initialPrompt={initialPrompt} />
    </div>
  );
};
