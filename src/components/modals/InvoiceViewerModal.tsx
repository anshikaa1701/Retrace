import React from 'react';
import { X, CheckCircle2, ShieldCheck, Download, Printer, Hash, Calendar, FileText } from 'lucide-react';

interface InvoiceViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  documentName?: string;
  actorName: string;
  cost?: number;
  partsReplaced?: string[];
  date: string;
  productCode: string;
  productModel: string;
}

export const InvoiceViewerModal: React.FC<InvoiceViewerModalProps> = ({
  isOpen,
  onClose,
  documentTitle,
  documentName = 'Service_Verification_Document.pdf',
  actorName,
  cost = 3000,
  partsReplaced = ['Thermal Interface Material', 'OEM Cooling Module'],
  date,
  productCode,
  productModel
}) => {
  if (!isOpen) return null;

  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-panel-elevated rounded-2xl border border-white/15 shadow-2xl overflow-hidden">
        
        {/* Header bar */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-surface-200/90">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <FileText className="w-4 h-4" />
            <span>AUTHENTICATED RECORD: {documentName}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Invoice Certificate Paper Layout */}
        <div className="p-6 md:p-8 space-y-6 max-h-[80vh] overflow-y-auto font-sans">
          
          {/* Top Organization Branding */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-xl text-white tracking-tight">
                  {actorName}
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono">
                  VERIFIED PARTNER
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                Authorized Hardware Diagnostics & Circular Service Facility
              </p>
            </div>

            <div className="text-right font-mono text-xs text-zinc-400">
              <div className="text-emerald-400 font-semibold">CERTIFICATE OF REPAIR</div>
              <div>ID: TRC-{Math.floor(100000 + Math.random() * 900000)}</div>
              <div>DATE: {formattedDate}</div>
            </div>
          </div>

          {/* Product Identification Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-surface-300/80 border border-white/5 font-mono text-xs">
            <div>
              <div className="text-[10px] text-zinc-500">TARGET PRODUCT</div>
              <div className="text-zinc-200 font-medium truncate">{productModel}</div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500">PRODUCT ID</div>
              <div className="text-emerald-400 font-bold">{productCode}</div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500">VERIFICATION</div>
              <div className="text-cyan-400 font-semibold">REPAIRER SIGNED</div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500">WARRENTY</div>
              <div className="text-zinc-300">180 DAYS BENCH</div>
            </div>
          </div>

          {/* Service Details & Line Items */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
              Work Performed & Genuine Components
            </h4>
            <div className="border border-white/10 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left font-mono">
                <thead className="bg-surface-200/90 text-zinc-400 text-[11px] border-b border-white/10">
                  <tr>
                    <th className="py-2.5 px-4">Item / Action Description</th>
                    <th className="py-2.5 px-4 text-center">Type</th>
                    <th className="py-2.5 px-4 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-300">
                  <tr>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{documentTitle}</div>
                      <div className="text-[11px] text-zinc-400">Ultrasonic heatsink purge, fan balancing & Arctic MX-6 paste</div>
                    </td>
                    <td className="py-3 px-4 text-center text-cyan-400 text-[11px]">SERVICE</td>
                    <td className="py-3 px-4 text-right font-medium">₹1,150.00</td>
                  </tr>
                  {partsReplaced.map((part, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-4">
                        <div className="text-white">{part}</div>
                        <div className="text-[11px] text-zinc-500">OEM Serial Tracked & Burn-In Validated</div>
                      </td>
                      <td className="py-3 px-4 text-center text-emerald-400 text-[11px]">HARDWARE</td>
                      <td className="py-3 px-4 text-right font-medium">₹{Math.max(cost - 1150, 1850).toLocaleString('en-IN')}.00</td>
                    </tr>
                  ))}
                  <tr className="bg-surface-300/40 font-bold text-white">
                    <td className="py-3 px-4" colSpan={2}>TOTAL VERIFIED WORK ORDER</td>
                    <td className="py-3 px-4 text-right text-emerald-400 text-sm">
                      ₹{cost.toLocaleString('en-IN')}.00
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Cryptographic Seal & Verification Hash */}
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-white font-semibold flex items-center gap-1.5">
                  <span>ON-CHAIN VERIFIED RECORD</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-[10px] text-zinc-400 truncate max-w-xs">
                  SHA-256: 0x9f7a81b32d04a6e8771c9b4e231182cf5504
                </div>
              </div>
            </div>

            {/* Simulated Stamp */}
            <div className="px-3 py-1.5 rounded border-2 border-emerald-500/60 text-emerald-400 font-bold uppercase tracking-widest text-[11px] -rotate-2 select-none shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              RETRACE SEALED
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-lg bg-surface-200 hover:bg-surface-100 text-xs font-mono text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 border border-white/5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono text-xs font-semibold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              CLOSE VIEWER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
