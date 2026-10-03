import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { aiService } from '../../services/aiService';
import { Product, AIAssessmentResponse } from '../../types';
import { NextPathCard } from './NextPathCard';
import { RepairVsReplacementChart } from './RepairVsReplacementChart';
import { 
  Cpu, 
  Send, 
  Sparkles, 
  Wrench, 
  Layers, 
  ShieldAlert, 
  ShieldCheck, 
  ArrowRight, 
  RefreshCw,
  Search,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AIChatProps {
  initialProduct?: Product;
  initialPrompt?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  assessment?: AIAssessmentResponse;
}

export const AIChat: React.FC<AIChatProps> = ({ initialProduct, initialPrompt }) => {
  const { products, getProductEvents } = useApp();
  const navigate = useNavigate();

  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProduct?.id || products[0]?.id || ''
  );
  const [inputText, setInputText] = useState(initialPrompt || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showNextPaths, setShowNextPaths] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `Hello, I am the ReTrace Circular Intelligence Engine. Select a registered product and describe symptoms to assess repairability, replacement costs, and circular pathways.`,
      timestamp: 'SYSTEM'
    }
  ]);

  const quickSymptoms = [
    'My laptop is overheating and shutting down.',
    'Battery drains in 30 minutes.',
    'Screen flickering with lines after being bumped.',
    'Device dropped in water / liquid ingress.'
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isAnalyzing) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsAnalyzing(true);
    setShowNextPaths(false);

    try {
      const history = getProductEvents(selectedProduct.productId);
      const assessment = await aiService.assessProductIssue(selectedProduct, textToSend, history);

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: `Based on the ${selectedProduct.brand} ${selectedProduct.model} specs, historical maintenance records, and reported symptoms, possible causes include ${assessment.possibleIssue}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        assessment
      };

      setMessages(prev => [...prev, aiMsg]);
      setShowNextPaths(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (initialPrompt && initialPrompt.includes('overheat')) {
      handleSendMessage('My laptop is overheating and shutting down.');
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAnalyzing]);

  const latestAssessment = [...messages].reverse().find(m => m.assessment)?.assessment;

  return (
    <div className="space-y-8 font-sans">
      
      {/* Product Selector Header Strip */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
              DIAGNOSTIC TARGET
            </span>
            <h3 className="font-display font-semibold text-white text-base">
              {selectedProduct.brand} {selectedProduct.model}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-500 hidden sm:inline">SWITCH DEVICE:</span>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="p-2 bg-surface-200 border border-white/10 rounded-xl text-xs font-mono text-white focus:border-emerald-500/50 focus:outline-none"
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.productId} — {p.brand} {p.model}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col h-[520px]">
        
        {/* Chat Stream Header */}
        <div className="p-3.5 bg-surface-200/90 border-b border-white/10 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-300">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>AI DIAGNOSTIC SESSION</span>
          </div>
          <span className="text-[11px] text-zinc-500">
            PASSPORT SYNCED: {selectedProduct.productId}
          </span>
        </div>

        {/* Message Bubble List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-500/30 rounded-br-sm'
                    : 'bg-surface-200/90 text-zinc-200 border border-white/10 rounded-bl-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1 text-[10px] font-mono text-zinc-500">
                  <span className={msg.sender === 'user' ? 'text-emerald-400' : 'text-cyan-400'}>
                    {msg.sender === 'user' ? 'YOU' : 'RETRACE INTELLIGENCE'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                <p>{msg.text}</p>

                {/* Structured Diagnostic Card in AI response */}
                {msg.assessment && (
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-3 font-mono">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="p-2.5 rounded-lg bg-surface-300/80 border border-white/5">
                        <span className="text-[9px] text-zinc-500 block uppercase">POSSIBLE ISSUE</span>
                        <span className="text-white text-xs font-semibold">Cooling / Thermal</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-surface-300/80 border border-white/5">
                        <span className="text-[9px] text-zinc-500 block uppercase">REPAIRABILITY</span>
                        <span className="text-emerald-400 text-xs font-semibold">{msg.assessment.repairability}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-surface-300/80 border border-white/5">
                        <span className="text-[9px] text-zinc-500 block uppercase">INSPECTION</span>
                        <span className="text-cyan-400 text-xs font-semibold">{msg.assessment.professionalInspection}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-surface-300/80 border border-white/5">
                        <span className="text-[9px] text-zinc-500 block uppercase">PARTS AVAILABILITY</span>
                        <span className="text-emerald-400 text-xs font-semibold">{msg.assessment.partAvailability}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-surface-300/50 border border-white/5 text-[11px] text-zinc-400 font-sans">
                      {msg.assessment.diagnosticSummary}
                    </div>

                    {/* Quick Action Buttons inside diagnostic card */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        onClick={() => setShowNextPaths(true)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-medium transition-all"
                      >
                        CHECK REPAIRABILITY
                      </button>
                      <button
                        onClick={() => navigate('/repairers')}
                        className="px-3 py-1.5 rounded-lg bg-surface-100 hover:bg-surface-50 border border-white/10 text-cyan-300 text-xs font-mono font-medium transition-all"
                      >
                        FIND REPAIRER
                      </button>
                      <button
                        onClick={() => navigate('/parts')}
                        className="px-3 py-1.5 rounded-lg bg-surface-100 hover:bg-surface-50 border border-white/10 text-zinc-300 text-xs font-mono font-medium transition-all"
                      >
                        VIEW PARTS
                      </button>
                    </div>

                    <div className="text-[10px] text-zinc-500 flex items-center gap-1 italic">
                      <ShieldAlert className="w-3 h-3 text-amber-500" />
                      <span>Professional bench inspection recommended for thermal heatsink & fan overhaul.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isAnalyzing && (
            <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 bg-surface-200/50 p-3 rounded-xl w-fit">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>Analyzing hardware profile + 2 previous service records...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Symptoms Chips */}
        <div className="p-3 bg-surface-300/40 border-t border-white/5 overflow-x-auto flex items-center gap-2">
          <span className="text-[10px] font-mono text-zinc-500 uppercase flex-shrink-0">
            PROMPTS:
          </span>
          {quickSymptoms.map((sym, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(sym)}
              className="px-2.5 py-1 rounded-full bg-surface-200 hover:bg-surface-100 border border-white/10 text-zinc-300 hover:text-emerald-300 text-[11px] whitespace-nowrap transition-colors"
            >
              {sym}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="p-3 bg-surface-200/90 border-t border-white/10 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Describe hardware symptoms (e.g. overheating and shutting down)..."
            className="flex-1 px-4 py-2.5 bg-surface-300 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors font-mono"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isAnalyzing}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-40"
          >
            <span>ANALYZE</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Downstream Next Path & Comparison Section */}
      {showNextPaths && latestAssessment && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <RepairVsReplacementChart
            repairCost={latestAssessment.repairEstimateAmount}
            replacementCost={latestAssessment.replacementCostAmount}
            productAge="2.5 years"
            partsAvailable={latestAssessment.partAvailability === 'AVAILABLE'}
            remainingLife={latestAssessment.potentialRemainingLife}
            resaleEstimate={selectedProduct.estimatedResaleMin}
          />

          <NextPathCard paths={latestAssessment.paths} />
        </div>
      )}
    </div>
  );
};
