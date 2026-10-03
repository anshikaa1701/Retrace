import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Camera, 
  QrCode, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  ScanLine, 
  RefreshCw, 
  Video,
  Plus,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

export const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { products, getProduct } = useApp();

  const [productIdInput, setProductIdInput] = useState('');
  const [scanState, setScanState] = useState<'IDLE' | 'SCANNING' | 'FOUND' | 'VERIFIED' | 'NOT_FOUND'>('IDLE');
  const [scannedCode, setScannedCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-trigger if demo query param is passed
  useEffect(() => {
    const demoParam = searchParams.get('demo');
    if (demoParam) {
      handleTriggerScan(demoParam);
    }
  }, [searchParams]);

  const handleTriggerScan = (codeToScan: string) => {
    const clean = codeToScan.trim().toUpperCase();
    setErrorMsg('');
    setScannedCode(clean);
    setScanState('SCANNING');

    // Step 1: Scanning optical QR pattern (800ms)
    setTimeout(() => {
      const match = getProduct(clean);
      if (!match) {
        setScanState('NOT_FOUND');
        setErrorMsg(`ReTrace product not found for code: "${clean}".`);
        return;
      }

      // Step 2: ReTrace Identity Found (600ms)
      setScanState('FOUND');

      // Step 3: Crypto Verified (600ms)
      setTimeout(() => {
        setScanState('VERIFIED');

        // Step 4: Open Verified Digital Passport
        setTimeout(() => {
          navigate(`/passport/${clean}`);
        }, 700);
      }, 600);
    }, 800);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productIdInput.trim()) return;
    handleTriggerScan(productIdInput);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto font-sans select-none space-y-8">
      
      {/* Title & Concept Clarification */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-xs">
          <ScanLine className="w-3.5 h-3.5 text-amber-400" />
          <span>QR Scanner & Passport Resolver</span>
        </div>

        <h1 className="font-display font-semibold text-2xl sm:text-3xl text-zinc-100 tracking-tight">
          Scan ReTrace QR Code
        </h1>

        <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto">
          Scan the physical QR identifier attached to your product to open its verifiable digital passport.
        </p>
      </div>

      {/* Main Scanner Container */}
      <div className="rounded-xl p-6 sm:p-8 bg-zinc-900 border border-zinc-800 text-center max-w-2xl mx-auto">
        
        {scanState === 'IDLE' && (
          <div className="space-y-6">
            
            {/* Viewfinder Frame */}
            <div className="relative mx-auto w-56 h-56 sm:w-64 sm:h-64 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center overflow-hidden">
              {/* Corner targeting reticles */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400" />

              <Camera className="w-10 h-10 text-zinc-500 mb-2" />
              <span className="font-mono text-xs text-zinc-300 font-medium">
                Align QR Code in Frame
              </span>
              <span className="font-mono text-[10px] text-zinc-500 mt-0.5">
                Optical Decoder Active
              </span>
            </div>

            {/* Quick Trigger Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <button
                onClick={() => handleTriggerScan('RP-DL-72891')}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>Simulate Camera Scan (Dell Inspiron 15)</span>
              </button>

              <button
                onClick={() => handleTriggerScan('RP-UNREGISTERED-000')}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700/80 text-zinc-300 font-mono text-xs border border-zinc-700 transition-colors cursor-pointer"
              >
                <span>Test Unregistered Code</span>
              </button>
            </div>

            {/* Manual ReTrace Product ID Search */}
            <div className="pt-5 border-t border-zinc-800 space-y-2.5">
              <div className="flex items-center justify-center gap-1.5 text-zinc-400 font-mono text-xs">
                <Search className="w-3.5 h-3.5 text-amber-400" />
                <span>Or enter ReTrace Product ID manually</span>
              </div>

              <form onSubmit={handleManualSubmit} className="flex items-center gap-2 max-w-sm mx-auto">
                <input
                  type="text"
                  value={productIdInput}
                  onChange={(e) => setProductIdInput(e.target.value)}
                  placeholder="e.g. RP-DL-72891"
                  className="flex-1 px-3 py-1.5 bg-zinc-950/60 border border-zinc-800 rounded-md text-zinc-200 font-mono text-xs focus:border-zinc-600 focus:outline-none uppercase"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-md bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Lookup</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* NOT FOUND STATE */}
        {scanState === 'NOT_FOUND' && (
          <div className="py-6 space-y-5">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 mx-auto flex items-center justify-center text-rose-400">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-display font-semibold text-xl text-zinc-100">
                Product Not Found
              </h3>
              <p className="text-zinc-400 font-mono text-xs max-w-md mx-auto leading-relaxed">
                The identifier <strong className="text-rose-400">&ldquo;{scannedCode}&rdquo;</strong> is not registered in the ReTrace decentralized passport network.
              </p>
            </div>

            {/* Callout: Add Product Manually */}
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 max-w-md mx-auto space-y-2.5">
              <div className="text-xs font-mono text-zinc-300">
                Need to register this device?
              </div>
              <Link
                to="/products/new"
                className="w-full py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Register This Product</span>
              </Link>
            </div>

            <div className="pt-1">
              <button
                onClick={() => setScanState('IDLE')}
                className="text-xs font-mono text-zinc-400 hover:text-zinc-200 underline cursor-pointer"
              >
                ← Scan Another QR Code
              </button>
            </div>
          </div>
        )}

        {/* SCANNING & VERIFICATION STATES */}
        {(scanState === 'SCANNING' || scanState === 'FOUND' || scanState === 'VERIFIED') && (
          <div className="py-8 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center">
              {scanState === 'SCANNING' && (
                <RefreshCw className="w-7 h-7 text-amber-400 animate-spin" />
              )}
              {scanState === 'FOUND' && (
                <QrCode className="w-7 h-7 text-zinc-100" />
              )}
              {scanState === 'VERIFIED' && (
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              )}
            </div>

            <div className="space-y-1 font-mono">
              <div className="text-[11px] text-zinc-500 uppercase tracking-wider">
                Resolving ReTrace Passport
              </div>
              <div className="font-display font-semibold text-lg text-zinc-100">
                {scanState === 'SCANNING' && 'Scanning optical pattern...'}
                {scanState === 'FOUND' && `Identity Recognized: ${scannedCode}`}
                {scanState === 'VERIFIED' && 'Passport Authenticated ✓'}
              </div>
              <p className="text-xs text-zinc-400">
                {scanState === 'VERIFIED'
                  ? 'Accessing verified hardware history...'
                  : 'Resolving Product ID from registry...'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Existing Registered Demo Presets */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block">
          Registered demo passports:
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => handleTriggerScan(p.productId)}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-left transition-colors font-mono text-xs cursor-pointer"
            >
              <span className="text-amber-400 font-semibold block">
                {p.productId}
              </span>
              <span className="text-[11px] text-zinc-400">
                {p.brand} {p.model}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
