import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, Check, ExternalLink, QrCode } from 'lucide-react';

interface QRCodeCardProps {
  productId: string;
  productName: string;
}

export const QRCodeCard: React.FC<QRCodeCardProps> = ({ productId, productName }) => {
  const [copied, setCopied] = useState(false);
  const passportUrl = `${window.location.origin}/passport/${productId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(passportUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const svg = document.getElementById(`qr-${productId}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = 400;
      canvas.height = 400;
      if (ctx) {
        ctx.fillStyle = '#080808';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20, 360, 360);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `ReTrace_Passport_${productId}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="rounded-xl p-5 bg-zinc-900 border border-zinc-800 relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <QrCode className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono font-medium tracking-wide text-zinc-300 uppercase">
            Passport QR Ledger
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          Verified
        </span>
      </div>

      {/* QR Code Container */}
      <div className="relative mx-auto my-3 p-3.5 rounded-lg bg-white flex items-center justify-center w-48 h-48 border border-zinc-700">
        <QRCodeSVG
          id={`qr-${productId}`}
          value={passportUrl}
          size={164}
          level="H"
          includeMargin={false}
          bgColor="#FFFFFF"
          fgColor="#09090b"
        />
      </div>

      <div className="text-center space-y-1 mb-4">
        <div className="text-xs font-mono font-semibold tracking-wider text-amber-400">
          {productId}
        </div>
        <p className="text-[11px] text-zinc-400">
          Scan to verify ownership, repair log, and condition trail.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800">
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 hover:text-white transition-colors border border-zinc-700 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
          <span>{copied ? 'Copied' : 'Copy Link'}</span>
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 hover:text-white transition-colors border border-zinc-700 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-zinc-400" />
          <span>Save PNG</span>
        </button>
      </div>
    </div>
  );
};
