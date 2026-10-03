import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { X, Send, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

interface OwnershipTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export const OwnershipTransferModal: React.FC<OwnershipTransferModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const { transferOwnership, currentUser } = useApp();
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail || !recipientName) return;

    transferOwnership(product.productId, recipientEmail, recipientName);
    setIsDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-panel-elevated rounded-2xl border border-white/15 shadow-2xl overflow-hidden font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-surface-200/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
              <Send className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-white text-sm">
                Transfer Digital Passport
              </h3>
              <p className="text-[11px] font-mono text-zinc-400">
                PRODUCT: {product.productId}
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

        {isDone ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>
            <h4 className="font-display font-bold text-lg text-white">
              Transfer Complete
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Ownership of <strong className="text-white">{product.brand} {product.model}</strong> has been transferred to <strong className="text-emerald-400">{recipientName}</strong> ({recipientEmail}).
            </p>
            <div className="p-3 rounded-xl bg-surface-300 border border-white/5 text-left font-mono text-[11px] text-zinc-400">
              ✓ Personal contact details stripped from public ledger.<br />
              ✓ Product maintenance history securely preserved.<br />
              ✓ Transfer event cryptographically anchored.
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono text-xs font-semibold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              DONE
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans">
            
            {/* Privacy Guarantee Alert */}
            <div className="p-3 rounded-xl bg-surface-300 border border-purple-500/30 font-mono text-[11px] text-purple-300 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white mb-0.5">Privacy Protected Handover</strong>
                The passport belongs to the product; your personal address, phone, and purchase receipts are never exposed to the recipient.
              </div>
            </div>

            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                New Owner Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Siddharth Rao"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full p-2.5 bg-surface-200 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:border-purple-500/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                New Owner Account Email
              </label>
              <input
                type="email"
                required
                placeholder="e.g. siddharth@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full p-2.5 bg-surface-200 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:border-purple-500/50 focus:outline-none"
              />
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="confirm-transfer"
                required
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-0.5 rounded border-white/20 bg-surface-200 text-purple-500 focus:ring-0"
              />
              <label htmlFor="confirm-transfer" className="text-[11px] text-zinc-400 cursor-pointer">
                I confirm that I have relinquished physical custody or agreed to sell this product to the recipient.
              </label>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-surface-200 text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!confirmed || !recipientEmail}
                className="px-5 py-2 rounded-lg bg-purple-500 hover:bg-purple-400 text-white font-mono font-semibold transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] disabled:opacity-50"
              >
                EXECUTE TRANSFER
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
