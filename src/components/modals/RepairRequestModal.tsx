import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, Repairer } from '../../types';
import { X, Wrench, Calendar, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RepairRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  preselectedRepairer?: Repairer;
  initialIssue?: string;
}

export const RepairRequestModal: React.FC<RepairRequestModalProps> = ({
  isOpen,
  onClose,
  product,
  preselectedRepairer,
  initialIssue = 'Thermal Management & Fan Rattle'
}) => {
  const { repairers, createRepairRequest, currentUser } = useApp();
  const navigate = useNavigate();

  const [selectedRepairerId, setSelectedRepairerId] = useState(
    preselectedRepairer?.id || repairers[0]?.id || ''
  );
  const [issue, setIssue] = useState(initialIssue);
  const [description, setDescription] = useState(
    'Machine exhibits elevated fan noise and unexpected shutdowns under moderate computational load. Requesting thermal inspection and fan assembly check.'
  );
  const [preferredDate, setPreferredDate] = useState('2026-09-28');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const selectedRepairer = repairers.find(r => r.id === selectedRepairerId) || repairers[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      createRepairRequest({
        productId: product.id,
        productName: `${product.brand} ${product.model}`,
        productCode: product.productId,
        customerId: currentUser.id,
        customerName: currentUser.name,
        repairerId: selectedRepairer.id,
        repairerName: selectedRepairer.name,
        issue,
        description,
        preferredDate,
        quoteAmount: 3000
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleFinish = () => {
    setIsSubmitted(false);
    onClose();
    navigate('/repairer/dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel-elevated rounded-2xl border border-white/15 shadow-2xl overflow-hidden font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-surface-200/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Wrench className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-white text-sm">
                Request Hardware Service
              </h3>
              <p className="text-[11px] font-mono text-zinc-400">
                PRODUCT: {product.productId} ({product.brand} {product.model})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h4 className="font-display font-bold text-lg text-white">
              Service Request Dispatched
            </h4>
            <p className="text-xs text-zinc-300 max-w-sm mx-auto leading-relaxed">
              Ticket assigned to <strong className="text-white">{selectedRepairer.name}</strong>. The repair partner has received your product history and passport telemetry.
            </p>

            <div className="p-4 rounded-xl bg-surface-300 border border-white/5 text-left font-mono text-xs space-y-1.5 text-zinc-400">
              <div className="flex justify-between">
                <span>STATUS:</span>
                <span className="text-amber-400">REQUESTED</span>
              </div>
              <div className="flex justify-between">
                <span>BENCH ESTIMATE:</span>
                <span className="text-emerald-400">₹3,000</span>
              </div>
              <div className="flex justify-between">
                <span>PREFERRED DATE:</span>
                <span className="text-zinc-200">{preferredDate}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleFinish}
                className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <span>OPEN REPAIRER PORTAL TO ACCEPT & VERIFY</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClose}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Close and stay on passport
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans">
            {/* Repairer Selector */}
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                Select Verified Repair Specialist
              </label>
              <select
                value={selectedRepairerId}
                onChange={(e) => setSelectedRepairerId(e.target.value)}
                className="w-full p-2.5 bg-surface-200 border border-white/10 rounded-xl text-white font-mono focus:border-cyan-500/50 focus:outline-none"
              >
                {repairers.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} — {r.specialty} ({r.distanceKm} km away)
                  </option>
                ))}
              </select>
            </div>

            {/* Issue Title */}
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                Primary Issue / Symptom
              </label>
              <input
                type="text"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                required
                className="w-full p-2.5 bg-surface-200 border border-white/10 rounded-xl text-white font-mono focus:border-cyan-500/50 focus:outline-none"
              />
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                Detailed Problem Notes
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full p-2.5 bg-surface-200 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:border-cyan-500/50 focus:outline-none"
              />
            </div>

            {/* Preferred Date */}
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                Preferred Drop-off / Inspection Date
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full p-2.5 bg-surface-200 border border-white/10 rounded-xl text-white font-mono focus:border-cyan-500/50 focus:outline-none"
              />
            </div>

            {/* Trust banner */}
            <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20 flex items-center gap-2.5 font-mono text-[11px] text-cyan-300">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 text-cyan-400" />
              <span>
                Repairs performed by verified partners receive cryptographic verification badges and auto-sync to your passport.
              </span>
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-surface-200 hover:bg-surface-100 text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono font-semibold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50"
              >
                {isSubmitting ? 'DISPATCHING TICKET...' : 'SEND REPAIR REQUEST'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
