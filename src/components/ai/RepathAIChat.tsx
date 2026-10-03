import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { geminiService, ChatMessage, ProductContextPayload } from '../../services/geminiService';
import { AIMessage } from './AIMessage';
import { UserMessage } from './UserMessage';
import { AIQuickActions } from './AIQuickActions';
import { 
  Sparkles, 
  X, 
  Minus, 
  RotateCcw, 
  Send, 
  Cpu, 
  ChevronDown, 
  AlertCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RepathAIChatProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

const INITIAL_GREETING = "Hi! I'm ReTrace AI.\nTell me about a small technical problem you're facing and I'll help you understand what might be wrong and what you can do next.";

export const RepathAIChat: React.FC<RepathAIChatProps> = ({ 
  isOpen, 
  onClose, 
  onMinimize 
}) => {
  const { products, currentUser } = useApp();
  const location = useLocation();

  // Selected device context (Prompt Item 7: Product-Aware AI)
  const [selectedProductId, setSelectedProductId] = useState<string>(
    products[0]?.productId || 'RP-DL-72891'
  );
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);

  // Chat message history with localStorage persistence
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('repath_ai_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback to fresh greeting
      }
    }
    return [
      {
        id: 'msg-init-1',
        role: 'model',
        text: INITIAL_GREETING,
        timestamp: 'Just now'
      }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const selectedProduct = products.find(p => p.productId === selectedProductId) || products[0];

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem('repath_ai_messages', JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, messages, isThinking]);

  // If viewing a specific product passport, automatically lock onto that product context
  useEffect(() => {
    const match = location.pathname.match(/\/passport\/([^/]+)/);
    if (match && match[1]) {
      const found = products.find(p => p.productId.toUpperCase() === match[1].toUpperCase());
      if (found) {
        setSelectedProductId(found.productId);
      }
    }
  }, [location.pathname, products]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent || isThinking) return;

    setInputText('');

    // Append user message
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    // Prepare product context payload (Prompt Item 7)
    let productContext: ProductContextPayload | undefined = undefined;
    if (selectedProduct) {
      productContext = {
        brand: selectedProduct.brand,
        model: selectedProduct.model,
        condition: selectedProduct.condition,
        repairCount: selectedProduct.repairCount,
        verifiedRepairsCount: selectedProduct.verifiedRepairsCount,
        lastRepair: selectedProduct.verifiedRepairsCount > 0 
          ? 'Cooling System Replaced & Thermal Overhaul' 
          : 'Factory Minted',
        serialNumber: selectedProduct.serialNumber
      };
    }

    // Call backend API (POST /api/ai/chat)
    const historyPayload = messages.slice(-6).map(m => ({
      role: m.role,
      text: m.text
    }));

    const response = await geminiService.sendChatMessage({
      message: messageContent,
      productId: selectedProduct?.productId,
      productContext,
      history: historyPayload
    });

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      role: 'model',
      text: response.reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      structuredAction: response.structuredAction,
      isError: !response.success
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsThinking(false);
  };

  const handleNewChat = () => {
    const fresh: ChatMessage[] = [
      {
        id: `msg-init-${Date.now()}`,
        role: 'model',
        text: INITIAL_GREETING,
        timestamp: 'Just now'
      }
    ];
    setMessages(fresh);
    localStorage.removeItem('repath_ai_messages');
  };

  const handleQuickChipSelect = (query: string) => {
    handleSendMessage(query);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 16 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[82vh] sm:h-[580px] max-h-[640px] rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl flex flex-col overflow-hidden select-none font-sans"
    >
      {/* Header */}
      <div className="px-4 py-3 bg-zinc-950/70 border-b border-zinc-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-zinc-100 text-xs sm:text-sm leading-none">
                ReTrace Assistant
              </h3>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Online</span>
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 mt-0.5">
              Powered by Google Gemini
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-0.5 text-zinc-400">
          <button
            type="button"
            onClick={handleNewChat}
            className="p-1.5 rounded-md hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Start New Chat"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onMinimize}
            className="p-1.5 rounded-md hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Close Assistant"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product-Aware Context Bar */}
      {products.length > 0 && (
        <div className="px-3.5 py-1.5 bg-zinc-950/40 border-b border-zinc-800/80 flex items-center justify-between text-[11px] font-mono relative">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Cpu className="w-3 h-3 text-zinc-500" />
            <span className="text-zinc-500">CONTEXT:</span>
            <span className="text-zinc-300 font-medium truncate max-w-[190px]">
              {selectedProduct ? `${selectedProduct.brand} ${selectedProduct.model}` : 'General Inquiry'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsProductMenuOpen(!isProductMenuOpen)}
            className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-0.5 cursor-pointer"
          >
            <span>Change</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {/* Context Dropdown Menu */}
          {isProductMenuOpen && (
            <div className="absolute top-full right-3 mt-1 z-30 w-64 rounded-lg bg-zinc-900 border border-zinc-700 p-1.5 shadow-xl space-y-0.5">
              <div className="px-2 py-1 text-[9px] text-zinc-500 uppercase tracking-wider">
                Select Product Context
              </div>
              {products.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedProductId(p.productId);
                    setIsProductMenuOpen(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded-md text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    selectedProductId === p.productId
                      ? 'bg-amber-400/10 text-amber-400 font-semibold'
                      : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <span className="truncate">{p.brand} {p.model}</span>
                  <span className="text-[10px] opacity-60 font-mono">{p.productId}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
        {messages.map((msg) => (
          msg.role === 'user' ? (
            <UserMessage 
              key={msg.id} 
              text={msg.text} 
              timestamp={msg.timestamp} 
            />
          ) : (
            <AIMessage 
              key={msg.id} 
              text={msg.text} 
              timestamp={msg.timestamp} 
              structuredAction={msg.structuredAction}
              onAskFollowUp={handleSendMessage}
            />
          )
        ))}

        {/* Quick Suggestion Chips below opening message */}
        {messages.length === 1 && (
          <div className="pt-2">
            <AIQuickActions 
              onSelectChip={handleQuickChipSelect}
              selectedProduct={selectedProduct}
              currentPath={location.pathname}
            />
          </div>
        )}

        {/* Typing / Thinking Indicator */}
        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-zinc-400 py-1.5 pl-2">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse" style={{ animationDelay: '200ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse" style={{ animationDelay: '400ms' }} />
            </div>
            <span>Analyzing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-zinc-950/70 border-t border-zinc-800 flex-shrink-0">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              selectedProduct 
                ? `Ask about ${selectedProduct.brand} ${selectedProduct.model}...`
                : 'Describe a hardware or battery issue...'
            }
            disabled={isThinking}
            className="flex-1 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs sm:text-sm font-sans focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 placeholder-zinc-500 transition-colors"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isThinking}
            className={`p-2 rounded-lg transition-colors cursor-pointer flex-shrink-0 ${
              inputText.trim() && !isThinking
                ? 'bg-amber-400 hover:bg-amber-300 text-black font-semibold'
                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 px-0.5">
          <span>Enterprise Gemini LLM</span>
          <span>Verified Device Data</span>
        </div>
      </div>
    </motion.div>
  );
};
