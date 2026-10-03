import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { X, Sparkles, TrendingUp, ShieldCheck, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ResaleEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export const ResaleEstimatorModal: React.FC<ResaleEstimatorModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const { createResaleListing, currentUser } = useApp();
  const navigate = useNavigate();

  const [condition, setCondition] = useState<Product['condition']>(product.condition);
  const [batteryHealth, setBatteryHealth] = useState(84);
  const [askingPrice, setAskingPrice] = useState(product.estimatedResaleMin + 500);
  const [accessories, setAccessories] = useState(['Original Charger', 'Laptop Sleeve']);
  const [isListed, setIsListed] = useState(false);

  if (!isOpen) return null;

  // Dynamic valuation formula
  const conditionMultipliers = {
    EXCELLENT: 1.15,
    GOOD: 1.0,
    FAIR: 0.8,
    DAMAGED: 0.5,
    IRREPARABLE: 0.25
  };

  const basePrice = product.estimatedResaleMin || 8500;
  const verifiedRepairsBonus = product.verifiedRepairsCount * 800;
  const batteryFactor = (batteryHealth / 100) * 0.9 + 0.1;

  const estimatedMin = Math.round((basePrice * conditionMultipliers[condition] * batteryFactor + verifiedRepairsBonus) / 100) * 100;
  const estimatedMax = Math.round(estimatedMin * 1.25 / 100) * 100;

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    createResaleListing({
      productId: product.id,
      productCode: product.productId,
      productName: `${product.brand} ${product.model}`,
      brand: product.brand,
      model: product.model,
      condition,
      age: '2.5 years',
      repairCount: product.repairCount,
      verifiedRepairsCount: product.verifiedRepairsCount,
      askingPrice: Number(askingPrice),
      originalPrice: product.brand === 'Apple' ? 119000 : 54990,
      description: `Authentic ${product.brand} ${product.model} with ${product.verifiedRepairsCount} verified service records recorded on ReTrace digital passport.`,
      accessories,
      images: [product.image],
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      hasPassport: true,
      batteryHealth: `${batteryHealth}%`
    });

    setIsListed(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel-elevated rounded-2xl border border-white/15 shadow-2xl overflow-hidden font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-surface-200/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-white text-sm">
                Resale Value Estimator & Marketplace
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

        {isListed ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>
            <h4 className="font-display font-bold text-lg text-white">
              Listing Published
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Your <strong className="text-white">{product.brand} {product.model}</strong> has been listed on the ReTrace Circular Marketplace for <strong className="text-emerald-400">₹{askingPrice.toLocaleString('en-IN')}</strong>.
            </p>
            <div className="p-3 rounded-xl bg-surface-300 border border-white/5 font-mono text-[11px] text-zinc-400 text-left">
              ✓ Digital Passport Included Badge Verified<br />
              ✓ {product.verifiedRepairsCount} Verified Repairs Visible to Buyers<br />
              ✓ Personal owner contact info hidden
            </div>
            <button
              onClick={() => {
                onClose();
                navigate('/resale');
              }}
              className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono text-xs font-semibold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>VIEW IN RESALE MARKETPLACE</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreateListing} className="p-6 space-y-5 text-xs font-sans">
            
            {/* Dynamic Valuation Output Box */}
            <div className="p-4 rounded-xl bg-surface-300 border border-emerald-500/30 relative overflow-hidden">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                  Estimated Resale Range
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  AI MARKET CALIBRATED
                </span>
              </div>

              <div className="font-display font-bold text-2xl text-emerald-400 my-1">
                ₹{estimatedMin.toLocaleString('en-IN')} – ₹{estimatedMax.toLocaleString('en-IN')}
              </div>

              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/10 text-[10px] font-mono text-zinc-400">
                <div>
                  <span className="text-zinc-500 block">MODEL</span>
                  <span className="text-zinc-200 truncate">{product.brand}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">CONDITION</span>
                  <span className="text-zinc-200">{condition}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">REPAIRS</span>
                  <span className="text-emerald-400">+{product.verifiedRepairsCount} VERIFIED</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">BATTERY</span>
                  <span className="text-cyan-400">{batteryHealth}%</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] font-mono text-zinc-500 italic">
              * Estimated range, not guaranteed sale price. Based on secondary market velocity and verified passport trust score.
            </p>

            {/* Inputs: Condition selector */}
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                Current Cosmetic & Functional Condition
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['EXCELLENT', 'GOOD', 'FAIR'] as const).map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setCondition(cond)}
                    className={`py-2 rounded-lg font-mono text-[11px] transition-all border ${
                      condition === cond
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold'
                        : 'bg-surface-200 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            {/* Battery Health Slider */}
            <div>
              <div className="flex justify-between font-mono text-[11px] text-zinc-400 mb-1">
                <span>BATTERY HEALTH TELEMETRY</span>
                <span className="text-cyan-400 font-bold">{batteryHealth}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={batteryHealth}
                onChange={(e) => setBatteryHealth(Number(e.target.value))}
                className="w-full h-1.5 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            {/* Asking Price Input */}
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                Your Asking Price (₹)
              </label>
              <input
                type="number"
                value={askingPrice}
                onChange={(e) => setAskingPrice(Number(e.target.value))}
                required
                className="w-full p-2.5 bg-surface-200 border border-white/10 rounded-xl text-white font-mono text-sm focus:border-emerald-500/50 focus:outline-none"
              />
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
                className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono font-semibold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                PUBLISH LISTING WITH PASSPORT
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
