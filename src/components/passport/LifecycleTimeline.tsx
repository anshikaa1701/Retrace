import React, { useState } from 'react';
import { LifecycleEvent, Product } from '../../types';
import { VerificationBadge } from '../common/Badges';
import { InvoiceViewerModal } from '../modals/InvoiceViewerModal';
import { 
  CheckCircle2, 
  Calendar, 
  Wrench, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  ArrowDown, 
  Layers, 
  Cpu, 
  User, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface LifecycleTimelineProps {
  events: LifecycleEvent[];
  product: Product;
}

export const LifecycleTimeline: React.FC<LifecycleTimelineProps> = ({ events, product }) => {
  const [selectedEvent, setSelectedEvent] = useState<LifecycleEvent | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const getEventIcon = (eventType: LifecycleEvent['eventType']) => {
    switch (eventType) {
      case 'MANUFACTURED':
        return <Cpu className="w-4 h-4 text-zinc-300" />;
      case 'REGISTERED':
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 'REPAIR':
        return <Wrench className="w-4 h-4 text-cyan-400" />;
      case 'MAINTAINED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'RESALE':
      case 'TRANSFER':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'RECOVERY':
      case 'END_OF_LIFE':
        return <ShieldCheck className="w-4 h-4 text-amber-400" />;
      default:
        return <Layers className="w-4 h-4 text-zinc-400" />;
    }
  };

  const handleOpenDoc = (event: LifecycleEvent) => {
    setSelectedEvent(event);
    setIsInvoiceModalOpen(true);
  };

  return (
    <div className="relative">
      {/* Vertical Track Line */}
      <div className="absolute left-4 sm:left-6 top-6 bottom-6 w-[2px] bg-gradient-to-b from-emerald-500/40 via-cyan-500/30 to-zinc-800" />

      <div className="space-y-8 relative">
        {events.map((event, index) => {
          const dateObj = new Date(event.timestamp);
          const year = dateObj.getFullYear();
          const formattedDate = dateObj.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });

          const isLatest = index === 0;

          return (
            <div
              key={event.id}
              className={`relative flex items-start gap-4 sm:gap-6 group transition-all`}
            >
              {/* Node Indicator with outer pulse on latest */}
              <div className="relative z-10 flex-shrink-0">
                <div
                  className={`w-8 h-8 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all border ${
                    isLatest
                      ? 'bg-emerald-500/20 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                      : event.verified
                      ? 'bg-surface-200 border-white/20 group-hover:border-emerald-500/40'
                      : 'bg-surface-300 border-white/10'
                  }`}
                >
                  {getEventIcon(event.eventType)}
                </div>
                {isLatest && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>

              {/* Event Card Content */}
              <div className="flex-1 glass-card rounded-2xl p-5 sm:p-6 border border-white/10 group-hover:border-white/20 transition-all">
                
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {year}
                    </span>
                    <h3 className="font-display font-semibold text-white text-base">
                      {event.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <VerificationBadge level={event.verificationLevel} size="sm" />
                    <span className="text-zinc-500 text-xs font-mono hidden sm:inline">
                      {formattedDate}
                    </span>
                  </div>
                </div>

                {/* Event Description */}
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-4">
                  {event.description}
                </p>

                {/* Parts replaced & metadata chips */}
                {event.partsReplaced && event.partsReplaced.length > 0 && (
                  <div className="mb-4 pt-3 border-t border-white/5">
                    <span className="text-[11px] font-mono text-zinc-500 block mb-1.5 uppercase">
                      Parts Replaced:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {event.partsReplaced.map((part, pIdx) => (
                        <span
                          key={pIdx}
                          className="px-2 py-0.5 rounded bg-surface-200 border border-white/10 text-emerald-300 font-mono text-[11px]"
                        >
                          + {part}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer with Actor, Cost & Document Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs text-zinc-400">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Logged by:</span>
                    <span className="text-zinc-200 font-medium">{event.actorName}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-white/5 rounded text-zinc-400">
                      {event.actorRole}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {event.cost && (
                      <span className="font-mono text-emerald-400 font-semibold">
                        Cost: ₹{event.cost.toLocaleString('en-IN')}
                      </span>
                    )}

                    {(event.documentName || event.verificationLevel !== 'USER_REPORTED') && (
                      <button
                        onClick={() => handleOpenDoc(event)}
                        className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-mono text-xs font-medium hover:underline transition-all"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Document</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invoice / Document Modal */}
      {selectedEvent && (
        <InvoiceViewerModal
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          documentTitle={selectedEvent.title}
          documentName={selectedEvent.documentName || `${selectedEvent.title.replace(/\s+/g, '_')}_Record.pdf`}
          actorName={selectedEvent.actorName}
          cost={selectedEvent.cost || 3000}
          partsReplaced={selectedEvent.partsReplaced || ['Dell OEM Service Pack']}
          date={selectedEvent.timestamp}
          productCode={product.productId}
          productModel={`${product.brand} ${product.model}`}
        />
      )}
    </div>
  );
};
