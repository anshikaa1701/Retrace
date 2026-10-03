import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ResaleListing, Product } from '../types';
import { ResaleEstimatorModal } from '../components/modals/ResaleEstimatorModal';
import { 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Tag, 
  ArrowRight, 
  Plus, 
  Search, 
  ExternalLink,
  BatteryCharging
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ResalePage: React.FC = () => {
  const { resaleListings, products } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isEstimatorModalOpen, setIsEstimatorModalOpen] = useState(false);
  const [targetProductForEstimator, setTargetProductForEstimator] = useState<Product>(products[0]);

  const filteredListings = resaleListings.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.productName.toLowerCase().includes(q);
      const matchCode = item.productCode.toLowerCase().includes(q);
      const matchBrand = item.brand.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchBrand) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="rounded-xl p-6 sm:p-8 bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-mono text-xs mb-2 border border-zinc-700">
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            <span>Circular Second-Life Marketplace</span>
          </div>
          <h1 className="font-display font-semibold text-2xl sm:text-3xl text-zinc-100">
            Pre-Owned Hardware with Verified Passports
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mt-1">
            Every device listed on ReTrace includes an immutable digital passport, verified service history, and battery health telemetry.
          </p>
        </div>

        <button
          onClick={() => {
            setTargetProductForEstimator(products[0]);
            setIsEstimatorModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono text-xs font-semibold flex items-center gap-2 transition-colors self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>List Device with Passport</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-zinc-900 border border-zinc-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search circular listings by model or Product ID..."
            className="w-full pl-9 pr-3 py-1.5 bg-zinc-950/60 border border-zinc-800 rounded-md text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 font-mono"
          />
        </div>

        <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
          {filteredListings.length} certified assets live
        </span>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredListings.map((item) => (
          <div
            key={item.id}
            className="rounded-xl p-5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col justify-between group space-y-4"
          >
            <div>
              {/* Image banner */}
              <div className="w-full h-44 rounded-lg overflow-hidden bg-zinc-950 mb-3 border border-zinc-800 relative">
                <img
                  src={item.images[0]}
                  alt={item.productName}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-zinc-950/90 border border-zinc-700 text-emerald-400 font-mono text-[10px] font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Passport Attached
                </span>
              </div>

              {/* Title & Product Code */}
              <div className="flex items-center justify-between gap-2 mb-1 font-mono text-xs">
                <span className="text-amber-400 font-semibold">{item.productCode}</span>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 text-[10px]">
                  {item.condition}
                </span>
              </div>

              <h3 className="font-display font-semibold text-base text-zinc-100 group-hover:text-amber-400 transition-colors mb-1">
                {item.productName}
              </h3>

              <p className="text-xs text-zinc-400 line-clamp-2 mb-3">
                {item.description}
              </p>

              {/* Telemetry Chips */}
              <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80 font-mono text-[11px] text-zinc-300 space-y-1 mb-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Verified Repairs:</span>
                  <span className="text-zinc-200">+{item.verifiedRepairsCount} Documented</span>
                </div>
                {item.batteryHealth && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Battery Telemetry:</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <BatteryCharging className="w-3 h-3" />
                      {item.batteryHealth}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-zinc-500">Device Age:</span>
                  <span className="text-zinc-300">{item.age}</span>
                </div>
              </div>
            </div>

            {/* Price & View Passport Button */}
            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between font-mono">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block">Asking Price</span>
                <span className="text-lg font-bold text-zinc-100">
                  ₹{item.askingPrice.toLocaleString('en-IN')}
                </span>
              </div>

              <Link
                to={`/passport/${item.productCode}`}
                className="py-1.5 px-3 rounded-md bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <span>Inspect Passport</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Resale Estimator Modal */}
      <ResaleEstimatorModal
        isOpen={isEstimatorModalOpen}
        onClose={() => setIsEstimatorModalOpen(false)}
        product={targetProductForEstimator}
      />
    </div>
  );
};
