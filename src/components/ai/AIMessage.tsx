import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Wrench, ShieldCheck, QrCode, CheckCircle2, AlertTriangle, Copy, Check } from 'lucide-react';
import { StructuredActionCard } from '../../services/geminiService';

interface AIMessageProps {
  text: string;
  timestamp?: string;
  structuredAction?: StructuredActionCard | null;
  onAskFollowUp?: (topic: string) => void;
}

export const AIMessage: React.FC<AIMessageProps> = ({ 
  text, 
  timestamp, 
  structuredAction, 
  onAskFollowUp 
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple Markdown formatter for bold, headings, bullets, and steps
  const renderFormattedMarkdown = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Headings
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-display font-bold text-white text-sm sm:text-base mt-2 mb-1 text-amber-300">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('#### ')) {
        return (
          <h5 key={idx} className="font-mono font-bold text-cyan-300 text-xs mt-2 mb-0.5 uppercase tracking-wide">
            {line.replace('#### ', '')}
          </h5>
        );
      }

      // Bullet points
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const bulletText = line.trim().replace(/^[-*]\s+/, '');
        return (
          <li key={idx} className="flex items-start gap-1.5 ml-2 my-0.5 text-zinc-300">
            <span className="text-amber-400 mt-0.5 text-xs">•</span>
            <span>{renderInlineStyles(bulletText)}</span>
          </li>
        );
      }

      // Numbered steps
      const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        return (
          <div key={idx} className="flex items-start gap-2 ml-1 my-1 text-zinc-300">
            <span className="w-4 h-4 rounded-full bg-white/[0.08] text-amber-400 text-[10px] font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              {numMatch[1]}
            </span>
            <span>{renderInlineStyles(numMatch[2])}</span>
          </div>
        );
      }

      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }

      return (
        <p key={idx} className="my-0.5 leading-relaxed text-zinc-300">
          {renderInlineStyles(line)}
        </p>
      );
    });
  };

  // Parse inline bold **text** and `code`
  const renderInlineStyles = (lineStr: string) => {
    const parts = lineStr.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="text-white font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-black/50 text-amber-300 font-mono text-xs border border-white/10">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex justify-start items-start gap-2.5 my-3 pr-4 group">
      {/* ReTrace AI Minimal Avatar */}
      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400/20 via-cyan-400/20 to-emerald-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 flex-shrink-0 mt-0.5 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
        <Sparkles className="w-3.5 h-3.5" />
      </div>

      <div className="flex flex-col space-y-2 max-w-[90%] flex-1">
        {/* Main Text Bubble */}
        <div className="p-4 rounded-2xl rounded-tl-sm bg-[#121218]/90 border border-white/[0.08] text-xs sm:text-sm font-sans shadow-md backdrop-blur-xl relative">
          <div className="space-y-1">
            {renderFormattedMarkdown(text)}
          </div>

          {/* Structured Action Card (Prompt Item 10) */}
          {structuredAction && (
            <div className="mt-4 pt-4 border-t border-white/[0.08] space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-black/50 border border-amber-400/30 space-y-2">
                
                {/* Likely Issue & Confidence */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">
                      LIKELY ISSUE
                    </span>
                    <span className="text-amber-300 font-bold text-xs">
                      {structuredAction.likelyIssue}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-zinc-500">CONFIDENCE:</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      structuredAction.confidence === 'High'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}>
                      {structuredAction.confidence}
                    </span>
                  </div>
                </div>

                {/* Next Safe Check */}
                <div className="pt-1">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">
                    NEXT SAFE CHECK
                  </span>
                  <p className="text-zinc-300 text-xs font-sans mt-0.5">
                    {structuredAction.nextSafeCheck}
                  </p>
                </div>

                {/* Recommended Path */}
                <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
                  <span className="text-[10px] text-zinc-500 uppercase">RECOMMENDED PATH:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                    {structuredAction.recommendedPath}
                  </span>
                </div>
              </div>

              {/* Action Buttons: [ VIEW PRODUCT PASSPORT ] [ FIND A REPAIRER ] [ ASK ANOTHER QUESTION ] */}
              <div className="flex flex-wrap gap-2 pt-1">
                {structuredAction.suggestedActions?.map((act, aIdx) => {
                  if (act.action === 'ask') {
                    return (
                      <button
                        key={aIdx}
                        type="button"
                        onClick={() => onAskFollowUp?.('Tell me more about troubleshooting this issue')}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.08] text-[11px] font-mono transition-colors cursor-pointer"
                      >
                        [ {act.label} ]
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={aIdx}
                      to={act.link}
                      className="px-3 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-mono font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>[ {act.label} ]</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="absolute top-2.5 right-2.5 p-1 rounded-md text-zinc-500 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            title="Copy response"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {timestamp && (
          <span className="text-[10px] font-mono text-zinc-500 pl-1">
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
};
