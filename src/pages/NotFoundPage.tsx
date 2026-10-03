import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, QrCode } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="glass-panel-elevated rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center space-y-6 border border-white/15 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-rose-400" />
        </div>

        <div className="space-y-2 font-mono">
          <span className="text-xs text-rose-400 font-bold uppercase tracking-wider block">
            ERROR 404 • REGISTRY EXCEPTION
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
            PRODUCT NOT FOUND
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
            This Product ID does not exist in the ReTrace network. Ensure the QR code was minted on the official protocol.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            to="/scan"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            <span>TRY AGAIN (SCAN)</span>
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-surface-200 hover:bg-surface-100 border border-white/10 text-zinc-300 hover:text-white font-mono text-xs font-medium"
          >
            RETURN HOME
          </Link>
        </div>
      </div>
    </div>
  );
};
