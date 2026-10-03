import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RecoveryPartner, Product } from '../types';
import { 
  Recycle, 
  Cpu, 
  ShieldCheck, 
  MapPin, 
  Truck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RecoveryPage: React.FC = () => {
  const { recoveryPartners, products, createRecoveryRequest, currentUser } = useApp();
  const navigate = useNavigate();

  const [selectedProductId, setSelectedProductId] = useState(
    products.find(p => p.condition === 'IRREPARABLE')?.id || products[products.length - 1].id
  );
  const [selectedPartnerId, setSelectedPartnerId] = useState(recoveryPartners[0].id);
  const [recoveryType, setRecoveryType] = useState<'SELL_FOR_PARTS' | 'MATERIAL_RECOVERY' | 'E_WASTE_RECYCLING'>('E_WASTE_RECYCLING');
  const [pickupAddress, setPickupAddress] = useState('Indiranagar 100ft Rd, Bangalore 560038');
  const [pickupDate, setPickupDate] = useState('2026-09-28');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];
  const selectedPartner = recoveryPartners.find(p => p.id === selectedPartnerId) || recoveryPartners[0];

  const handleRequestRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    createRecoveryRequest({
      productId: selectedProduct.id,
      productName: `${selectedProduct.brand} ${selectedProduct.model}`,
      productCode: selectedProduct.productId,
      partnerId: selectedPartner.id,
      partnerName: selectedPartner.name,
      recoveryType,
      condition: selectedProduct.condition === 'IRREPARABLE' ? 'Irreparable motherboard oxidation' : selectedProduct.condition,
      estimatedValue: recoveryType === 'SELL_FOR_PARTS' ? 2500 : recoveryType === 'MATERIAL_RECOVERY' ? 1400 : 800,
      pickupAddress,
      pickupDate
    });

    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs">
          <Recycle className="w-3.5 h-3.5" />
          <span>Zero-Landfill Recovery Portal</span>
        </div>
        <h1 className="font-display font-semibold text-2xl sm:text-3xl text-zinc-100 tracking-tight">
          If it cannot be repaired, it still has circular value.
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto">
          Prevent electronic waste from entering landfills. ReTrace coordinates with certified hydrometallurgical refineries and component harvesters.
        </p>
      </div>

      {/* 3 Circular Recovery Paths */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Path 1: Sell For Parts */}
        <div
          onClick={() => setRecoveryType('SELL_FOR_PARTS')}
          className={`rounded-xl p-5 border cursor-pointer transition-colors flex flex-col justify-between ${
            recoveryType === 'SELL_FOR_PARTS'
              ? 'border-amber-400 bg-zinc-900'
              : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-amber-400" />
              </div>
              <span className="font-mono text-xs text-amber-400 font-semibold">Est. ₹2,000 – ₹3,500</span>
            </div>
            <h3 className="font-display font-semibold text-base text-zinc-100 mb-1.5">Sell for Parts</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Harvest working sub-modules (screen panels, RAM, storage drives, Wi-Fi chips) for computer refurbishing programs.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800 font-mono text-[11px] text-zinc-400 flex items-center justify-between">
            <span>Salvage Rate: 65%</span>
            <span className={recoveryType === 'SELL_FOR_PARTS' ? 'text-amber-400 font-semibold' : 'text-zinc-500'}>
              {recoveryType === 'SELL_FOR_PARTS' ? 'Selected ✓' : 'Select'}
            </span>
          </div>
        </div>

        {/* Path 2: Material Recovery */}
        <div
          onClick={() => setRecoveryType('MATERIAL_RECOVERY')}
          className={`rounded-xl p-5 border cursor-pointer transition-colors flex flex-col justify-between ${
            recoveryType === 'MATERIAL_RECOVERY'
              ? 'border-amber-400 bg-zinc-900'
              : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-mono text-xs text-emerald-400 font-semibold">Est. ₹1,200 – ₹1,800</span>
            </div>
            <h3 className="font-display font-semibold text-base text-zinc-100 mb-1.5">Material Recovery</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Hydro-metallurgical refining extracts gold, copper, silver, and neodymium magnets from oxidized printed circuit boards.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800 font-mono text-[11px] text-zinc-400 flex items-center justify-between">
            <span>Purity: 99.4%</span>
            <span className={recoveryType === 'MATERIAL_RECOVERY' ? 'text-amber-400 font-semibold' : 'text-zinc-500'}>
              {recoveryType === 'MATERIAL_RECOVERY' ? 'Selected ✓' : 'Select'}
            </span>
          </div>
        </div>

        {/* Path 3: E-Waste Recycling */}
        <div
          onClick={() => setRecoveryType('E_WASTE_RECYCLING')}
          className={`rounded-xl p-5 border cursor-pointer transition-colors flex flex-col justify-between ${
            recoveryType === 'E_WASTE_RECYCLING'
              ? 'border-amber-400 bg-zinc-900'
              : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <Recycle className="w-4 h-4 text-zinc-200" />
              </div>
              <span className="font-mono text-xs text-zinc-300 font-semibold">Est. ₹500 – ₹900</span>
            </div>
            <h3 className="font-display font-semibold text-base text-zinc-100 mb-1.5">E-Waste Recycling</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              R2v3 Certified zero-landfill smelting with certified toxic neutralisation and cryptographic certificate of destruction.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800 font-mono text-[11px] text-zinc-400 flex items-center justify-between">
            <span>Landfill Diversion: 100%</span>
            <span className={recoveryType === 'E_WASTE_RECYCLING' ? 'text-amber-400 font-semibold' : 'text-zinc-500'}>
              {recoveryType === 'E_WASTE_RECYCLING' ? 'Selected ✓' : 'Select'}
            </span>
          </div>
        </div>
      </div>

      {/* Dispatch Recovery Pickup Form */}
      <div className="rounded-xl p-6 sm:p-8 bg-zinc-900 border border-zinc-800 max-w-2xl mx-auto">
        {isSubmitted ? (
          <div className="py-6 text-center space-y-4 font-sans">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="font-display font-semibold text-xl text-zinc-100">
              Recovery Pickup Scheduled
            </h3>
            <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
              Ticket dispatched to <strong className="text-zinc-100">{selectedPartner.name}</strong> for <strong className="text-emerald-400">{selectedProduct.brand} {selectedProduct.model}</strong>.
            </p>
            <div className="p-3.5 rounded-lg bg-zinc-950/60 border border-zinc-800 text-left font-mono text-xs space-y-1 text-zinc-400">
              <div>Courier: GreenCycle Logistics Fleet</div>
              <div>Pickup Date: {pickupDate}</div>
              <div>Address: {pickupAddress}</div>
              <div className="text-emerald-400 font-medium">Estimated Circular Value: ₹800</div>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
              <button
                onClick={() => navigate('/recycler/dashboard')}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono text-xs font-semibold cursor-pointer transition-colors"
              >
                Open Recycler Portal to Accept Pickup
              </button>
              <button
                onClick={() => setIsSubmitted(false)}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700/80 text-zinc-300 font-mono text-xs cursor-pointer transition-colors"
              >
                Schedule Another Device
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRequestRecovery} className="space-y-4 text-xs font-sans">
            <div className="border-b border-zinc-800 pb-3">
              <h3 className="font-display font-semibold text-lg text-zinc-100">
                Dispatch Courier Pickup Request
              </h3>
              <p className="text-zinc-400 text-xs mt-0.5">
                Authorized circular partners pick up directly from your doorstep with chain-of-custody tracking.
              </p>
            </div>

            {/* Select Target Device */}
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                Target Device to Retire
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full p-2.5 bg-zinc-950/60 border border-zinc-800 rounded-lg text-zinc-200 font-mono focus:border-zinc-600 focus:outline-none"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.productId} — {p.brand} {p.model} ({p.condition})
                  </option>
                ))}
              </select>
            </div>

            {/* Select Recovery Partner */}
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                Certified Recovery Facility
              </label>
              <select
                value={selectedPartnerId}
                onChange={(e) => setSelectedPartnerId(e.target.value)}
                className="w-full p-2.5 bg-zinc-950/60 border border-zinc-800 rounded-lg text-zinc-200 font-mono focus:border-zinc-600 focus:outline-none"
              >
                {recoveryPartners.map(rp => (
                  <option key={rp.id} value={rp.id}>
                    {rp.name} — {rp.typeLabel} ({rp.distanceKm} km away)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                  Pickup Address
                </label>
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  required
                  className="w-full p-2 bg-zinc-950/60 border border-zinc-800 rounded-lg text-zinc-200 font-mono focus:border-zinc-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                  Preferred Pickup Date
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full p-2 bg-zinc-950/60 border border-zinc-800 rounded-lg text-zinc-200 font-mono focus:border-zinc-600 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono text-xs font-semibold transition-colors cursor-pointer"
            >
              Dispatch Recovery Courier (₹800 Payout Estimate)
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
