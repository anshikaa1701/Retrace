import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Repairer } from '../types';
import { RepairRequestModal } from '../components/modals/RepairRequestModal';
import { 
  Wrench, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Clock, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';

export const RepairersPage: React.FC = () => {
  const { repairers, products, getProduct } = useApp();
  const [searchParams] = useSearchParams();

  const productParam = searchParams.get('product');
  const targetProduct = productParam ? getProduct(productParam) : products[0];

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [maxDistance, setMaxDistance] = useState(10);
  const [verifiedOnly, setVerifiedOnly] = useState(true);

  const [selectedRepairerForModal, setSelectedRepairerForModal] = useState<Repairer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactModalRepairer, setContactModalRepairer] = useState<Repairer | null>(null);

  const filteredRepairers = repairers.filter((r) => {
    if (verifiedOnly && !r.verified) return false;
    if (r.distanceKm > maxDistance) return false;
    if (categoryFilter !== 'ALL' && !r.category.includes(categoryFilter)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.name.toLowerCase().includes(q);
      const matchSpec = r.specialty.toLowerCase().includes(q);
      const matchLoc = r.location.toLowerCase().includes(q);
      const matchServ = r.services.some(s => s.toLowerCase().includes(q));
      if (!matchName && !matchSpec && !matchLoc && !matchServ) return false;
    }
    return true;
  });

  const handleOpenRepairModal = (repairer: Repairer) => {
    setSelectedRepairerForModal(repairer);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Title */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-xs">
          <Wrench className="w-3.5 h-3.5 text-amber-400" />
          <span>Verified Specialist Directory</span>
        </div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-zinc-100 tracking-tight">
          Certified Hardware Technicians
        </h1>
        <p className="text-zinc-400 text-sm">
          Authorized technicians with authenticated testing gear. Repairs completed by network specialists automatically sync cryptographic verification to your digital passport.
        </p>

        <div className="pt-1">
          <Link
            to="/repairer/register"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-mono font-medium text-xs transition-colors"
          >
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            <span>Register as Repair Partner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-xl p-4 bg-zinc-900 border border-zinc-800 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by specialist name, symptom, or service (e.g. thermal, battery)..."
              className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs font-mono text-zinc-200 focus:outline-none focus:border-amber-400 w-full md:w-auto"
            >
              <option value="ALL">All Categories</option>
              <option value="Laptop">Laptops</option>
              <option value="Smartphone">Smartphones</option>
              <option value="Tablet">Tablets</option>
              <option value="Audio">Audio / Portable</option>
            </select>

            {/* Distance Slider */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg font-mono text-xs text-zinc-400 whitespace-nowrap">
              <span>RADIUS:</span>
              <span className="text-amber-400 font-bold">{maxDistance}km</span>
              <input
                type="range"
                min="1"
                max="25"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-20 accent-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Verification Filter Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-zinc-400 pt-2 border-t border-zinc-800">
          <span>{filteredRepairers.length} SPECIALISTS FOUND NEARBY</span>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="rounded bg-zinc-950 border-zinc-700 text-amber-500"
            />
            <span>VERIFIED ONLY</span>
          </label>
        </div>
      </div>

      {/* Repairers List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRepairers.map((repairer) => (
          <div
            key={repairer.id}
            className="rounded-xl p-5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col justify-between group space-y-4"
          >
            <div>
              {/* Header row */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={repairer.avatar}
                    alt={repairer.name}
                    className="w-12 h-12 rounded-lg object-cover border border-zinc-700"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-semibold text-base text-zinc-100 group-hover:text-amber-400 transition-colors">
                        {repairer.name}
                      </h3>
                      {repairer.verified && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-mono flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          VERIFIED
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-zinc-400 font-mono">
                      {repairer.specialty}
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono text-xs">
                  <span className="text-zinc-200 font-bold block">{repairer.distanceKm} km</span>
                  <div className="flex items-center gap-1 text-amber-400 text-[11px] justify-end mt-0.5">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{repairer.rating}</span>
                    <span className="text-zinc-500">({repairer.reviewCount})</span>
                  </div>
                </div>
              </div>

              {/* Location & Response time */}
              <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 mb-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  {repairer.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  {repairer.responseTime}
                </span>
              </div>

              {/* Services Tags */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">
                  Supported Services:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {repairer.services.map((service, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700/80 text-zinc-300 text-xs font-mono"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-800 font-mono text-xs">
              <Link
                to={`/repairers/${repairer.id}`}
                className="py-1.5 px-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white transition-colors text-center flex items-center justify-center gap-1"
              >
                <span>Profile</span>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </Link>

              <button
                onClick={() => setContactModalRepairer(repairer)}
                className="py-1.5 px-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white transition-colors text-center flex items-center justify-center gap-1 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-zinc-400" />
                <span>Contact</span>
              </button>

              <button
                onClick={() => handleOpenRepairModal(repairer)}
                className="py-1.5 px-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Request</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Request Repair Modal */}
      {targetProduct && (
        <RepairRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={targetProduct}
          preselectedRepairer={selectedRepairerForModal || undefined}
        />
      )}

      {/* Quick Contact Modal */}
      {contactModalRepairer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="p-5 rounded-xl max-w-sm w-full bg-zinc-900 border border-zinc-800 space-y-4 font-sans text-xs">
            <h3 className="font-display font-semibold text-base text-zinc-100">
              {contactModalRepairer.name}
            </h3>
            <div className="font-mono space-y-2 text-zinc-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>{contactModalRepairer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>{contactModalRepairer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-zinc-500" />
                <span>{contactModalRepairer.location}</span>
              </div>
            </div>
            <button
              onClick={() => setContactModalRepairer(null)}
              className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg font-mono text-xs cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
