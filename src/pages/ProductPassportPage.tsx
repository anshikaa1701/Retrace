import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { QRCodeCard } from '../components/passport/QRCodeCard';
import { LifecycleTimeline } from '../components/passport/LifecycleTimeline';
import { StatusBadge, VerificationBadge, ConditionBadge } from '../components/common/Badges';
import { RepairRequestModal } from '../components/modals/RepairRequestModal';
import { OwnershipTransferModal } from '../components/modals/OwnershipTransferModal';
import { ResaleEstimatorModal } from '../components/modals/ResaleEstimatorModal';
import { RepairVsReplacementChart } from '../components/ai/RepairVsReplacementChart';
import { NextPathCard } from '../components/ai/NextPathCard';
import { 
  Cpu, 
  Wrench, 
  Sparkles, 
  ShoppingBag, 
  Recycle, 
  Send, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  BatteryCharging,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { maskIdentifier } from '../services/deviceDatabaseService';

export const ProductPassportPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { getProduct, getProductEvents, currentUser } = useApp();

  const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isResaleModalOpen, setIsResaleModalOpen] = useState(false);
  const [showRepairabilityModal, setShowRepairabilityModal] = useState(false);

  const product = getProduct(productId || 'RP-DL-72891');
  const events = getProductEvents(product?.productId || 'RP-DL-72891');

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-rose-400" />
        </div>
        <h2 className="font-display font-bold text-2xl text-white">
          Product Not Found
        </h2>
        <p className="text-zinc-400 text-sm max-w-md">
          Product ID &ldquo;{productId}&rdquo; does not exist in the ReTrace decentralized passport registry.
        </p>
        <Link
          to="/scan"
          className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono text-xs font-semibold"
        >
          TRY ANOTHER SCAN
        </Link>
      </div>
    );
  }

  const isOwner = currentUser.role === 'OWNER' && currentUser.name === product.ownerName;
  const isAuthorizedViewer = isOwner || currentUser.role === 'ADMIN';
  const [showRawIdentifier, setShowRawIdentifier] = useState(false);
  const isSmartphone = product.category === 'Smartphone';
  const maskedId = product.maskedImei || maskIdentifier(product.serialNumber, isSmartphone);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Top Banner: Passport Identity & Quick Status */}
      <div className="rounded-xl p-5 sm:p-6 bg-zinc-900 border border-zinc-800 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left 2 Cols: Main Info */}
          <div className="lg:col-span-2 space-y-5">
            
            {/* Tag & ID Pill */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/25 px-2.5 py-0.5 rounded">
                {product.productId}
              </span>
              <StatusBadge status={product.lifecycleStatus} />
              <ConditionBadge condition={product.condition} />
              <span className="px-2 py-0.5 text-xs font-mono rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                {product.verifiedRepairsCount} verified repairs
              </span>
            </div>

            {/* Product Title */}
            <div>
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                {product.brand} • {product.category.toUpperCase()}
              </span>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-zinc-100 tracking-tight">
                {product.model}
              </h1>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80 font-mono">
                <span className="text-[10px] text-zinc-400 block uppercase">Product Age</span>
                <span className="text-zinc-200 text-sm font-semibold">2.5 Years</span>
              </div>

              <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80 font-mono">
                <span className="text-[10px] text-zinc-400 block uppercase">Repairability</span>
                <span className="text-emerald-400 text-sm font-semibold">
                  {product.repairabilityScore} / 10
                </span>
              </div>

              <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80 font-mono">
                <span className="text-[10px] text-zinc-400 block uppercase">Resale Est.</span>
                <span className="text-zinc-200 text-sm font-semibold">
                  ₹{product.estimatedResaleMin.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80 font-mono">
                <span className="text-[10px] text-zinc-400 block uppercase">Warranty</span>
                <span className="text-zinc-300 text-xs font-medium truncate block">
                  {product.warranty}
                </span>
              </div>
            </div>

            {/* Action Buttons Toolbar */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Link
                to={`/ai-assistant?code=${product.productId}&prompt=overheating`}
                className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Cpu className="w-3.5 h-3.5 text-zinc-950" />
                <span>Ask AI Diagnostics</span>
              </Link>

              <button
                onClick={() => setShowRepairabilityModal(!showRepairabilityModal)}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-mono text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Wrench className="w-3.5 h-3.5 text-amber-400" />
                <span>Check Repairability</span>
              </button>

              <button
                onClick={() => setIsRepairModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-mono text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Request Repair</span>
              </button>

              <button
                onClick={() => setIsResaleModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-mono text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-zinc-400" />
                <span>List on Resale</span>
              </button>

              <button
                onClick={() => setIsTransferModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-mono text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-zinc-400" />
                <span>Transfer Passport</span>
              </button>
            </div>
          </div>

          {/* Right Col: Genuine QR Code Card */}
          <div className="lg:col-span-1">
            <QRCodeCard productId={product.productId} productName={`${product.brand} ${product.model}`} />
          </div>
        </div>
      </div>

      {/* Expandable Repairability Assessment Box */}
      {showRepairabilityModal && (
        <div className="rounded-xl p-5 sm:p-6 bg-zinc-900 border border-zinc-800 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="font-display font-semibold text-lg text-zinc-100">
                Next Path Assessment: {product.brand} {product.model}
              </h3>
            </div>
            <button
              onClick={() => setShowRepairabilityModal(false)}
              className="text-xs font-mono text-zinc-400 hover:text-zinc-200 cursor-pointer"
            >
              [ Close Analysis ]
            </button>
          </div>

          <RepairVsReplacementChart
            repairCost={3000}
            replacementCost={15000}
            productAge="2.5 years"
            partsAvailable={true}
            remainingLife="2–3 years"
            resaleEstimate={product.estimatedResaleMin}
          />

          <NextPathCard
            paths={[
              {
                type: 'REPAIR',
                title: 'Thermal Overhaul & Fan Replacement',
                costEstimate: '₹3,000',
                remainingLife: '2–3 years',
                pros: [
                  'Preserves current software & developer environment',
                  'Saves ₹12,000 compared to equivalent laptop replacement',
                  'Verified repair boosts secondary resale score'
                ],
                cons: ['Requires 1-2 days bench time at TechFix'],
                actionLabel: 'Book Bench Repair',
                actionRoute: `/repairers?product=${product.productId}`,
                confidence: 94,
                recommended: true
              },
              {
                type: 'RESELL',
                title: 'Circular Marketplace Resale',
                valueEstimate: '₹8,500 – ₹11,000',
                remainingLife: '2+ years (2nd Owner)',
                pros: ['Instant liquid cash return', 'Digital passport transfers with verifiable pedigree'],
                cons: ['Must procure replacement system'],
                actionLabel: 'Open Resale Form',
                actionRoute: '/resale',
                confidence: 80,
                recommended: false
              },
              {
                type: 'RECOVER',
                title: 'Component Harvesting',
                valueEstimate: '₹2,000 – ₹3,500',
                remainingLife: 'Harvested modular parts',
                pros: ['Salvages 16GB DDR4 RAM and 512GB SSD'],
                cons: ['Scraps working motherboard'],
                actionLabel: 'Component Recovery',
                actionRoute: '/recovery',
                confidence: 45,
                recommended: false
              },
              {
                type: 'RECYCLE',
                title: 'R2v3 Zero-Landfill E-Waste Smelting',
                valueEstimate: '₹500 – ₹800',
                remainingLife: 'Closed loop materials',
                pros: ['Official certificate of destruction', 'Precious metal recovery'],
                cons: ['Premature for a machine in Good condition'],
                actionLabel: 'Find Recycler',
                actionRoute: '/recovery',
                confidence: 20,
                recommended: false
              }
            ]}
            onSelectAction={(path) => {
              if (path.type === 'REPAIR') {
                setIsRepairModalOpen(true);
              } else if (path.type === 'RESELL') {
                setIsResaleModalOpen(true);
              } else {
                navigate(path.actionRoute);
              }
            }}
          />
        </div>
      )}

      {/* Main Split Grid: Hardware Specs on Left, Vertical Lifecycle Timeline on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Specifications & Circular Hardware Breakdown */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Hardware Specs Card */}
          <div className="rounded-xl p-5 bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-mono font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                Hardware Specifications
              </span>
              <span className="text-[10px] font-mono text-zinc-500">OEM Validated</span>
            </div>

            <div className="space-y-2.5 font-mono text-xs text-zinc-300">
              <div className="flex justify-between items-center border-b border-zinc-800/80 pb-2">
                <span className="text-zinc-500 uppercase">
                  {isSmartphone ? 'IMEI NUMBER' : 'SERIAL NUMBER'}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-100 font-medium">
                    {isAuthorizedViewer && showRawIdentifier ? product.serialNumber : maskedId}
                  </span>
                  {isAuthorizedViewer ? (
                    <button
                      type="button"
                      onClick={() => setShowRawIdentifier(!showRawIdentifier)}
                      className="text-zinc-400 hover:text-zinc-200 p-0.5 cursor-pointer"
                      title={showRawIdentifier ? 'Hide raw identifier' : 'Reveal full identifier'}
                    >
                      {showRawIdentifier ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  ) : (
                    <span className="text-[10px] text-zinc-500 flex items-center gap-0.5" title="Masked on public ledger">
                      <Lock className="w-3 h-3 text-emerald-400" />
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-zinc-500">PROCESSOR</span>
                <span className="text-zinc-100 font-medium text-right max-w-[180px] truncate">{product.specs.processor}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-zinc-500">MEMORY (RAM)</span>
                <span className="text-emerald-400 font-medium">{product.specs.ram}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-zinc-500">STORAGE</span>
                <span className="text-zinc-100 font-medium">{product.specs.storage}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-zinc-500">BATTERY TELEMETRY</span>
                <span className="text-zinc-200 font-medium flex items-center gap-1">
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                  {product.specs.batteryHealth}
                </span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-zinc-500">LEDGER IDENTIFIER</span>
                <span className="text-amber-400 font-medium">{product.productId}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-zinc-500">INVOICE PROOF</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {product.invoiceName || 'Dell_Tax_Invoice_2025.pdf'}
                </span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-zinc-500">CURRENT OWNER</span>
                <span className="text-zinc-300 font-medium">
                  {isAuthorizedViewer ? `${product.ownerName} (${isOwner ? 'You' : 'Owner'})` : 'Verified ReTrace Owner ✓'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">PURCHASE DATE</span>
                <span className="text-zinc-300">{product.purchaseDate}</span>
              </div>
            </div>
          </div>

          {/* Privacy & Safe Public Passport Badge */}
          <div className="rounded-xl p-4 bg-zinc-900 border border-zinc-800 font-mono text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>Privacy Preserving Passport</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Public viewers and QR scanners see verifiable hardware specs and maintenance history. Personal owner contact info, private invoices, and home addresses remain shielded.
            </p>
          </div>
        </div>

        {/* Right 2 Columns: Vertical Lifecycle Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                Lifecycle Ledger
              </span>
              <h2 className="font-display font-bold text-lg text-zinc-100">
                Verifiable Service History
              </h2>
            </div>

            <div className="text-xs font-mono text-zinc-400">
              {events.length} lifecycle events
            </div>
          </div>

          {/* Vertical Timeline Component */}
          <LifecycleTimeline events={events} product={product} />
        </div>
      </div>

      {/* Modals */}
      <RepairRequestModal
        isOpen={isRepairModalOpen}
        onClose={() => setIsRepairModalOpen(false)}
        product={product}
      />

      <OwnershipTransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        product={product}
      />

      <ResaleEstimatorModal
        isOpen={isResaleModalOpen}
        onClose={() => setIsResaleModalOpen(false)}
        product={product}
      />
    </div>
  );
};
