import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Recycle, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  FileText, 
  Upload, 
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RecyclerDashboardPage: React.FC = () => {
  const { 
    currentUser, 
    switchRole, 
    recoveryRequests, 
    acceptRecoveryPickup, 
    verifyRecovery 
  } = useApp();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'requests' | 'collected'>('requests');
  const [proofUploaded, setProofUploaded] = useState(true);

  const pendingRequests = recoveryRequests.filter(r => r.status === 'REQUESTED');
  const acceptedRequests = recoveryRequests.filter(r => r.status === 'ACCEPTED');
  const verifiedRecoveries = recoveryRequests.filter(r => r.status === 'VERIFIED');

  const handleAccept = (reqId: string) => {
    acceptRecoveryPickup(reqId);
  };

  const handleVerify = (reqId: string, productCode: string) => {
    verifyRecovery(reqId, 'GreenCycle_Destruction_And_Smelt_Certificate_R2v3.pdf');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.3 },
      colors: ['#14B8A6', '#10B981', '#ffffff']
    });
    setActiveTab('collected');
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Universal Quick Role Switcher Bar */}
      <div className="p-2 sm:p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 pl-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
            Active Role: <strong className="text-zinc-200">{currentUser.role} (GreenCycle Hub)</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {(['OWNER', 'REPAIRER', 'RECYCLER', 'ADMIN'] as const).map((r) => {
            const isActive = currentUser.role === r;
            return (
              <button
                key={r}
                onClick={() => {
                  switchRole(r);
                  if (r === 'OWNER') navigate('/dashboard');
                  else if (r === 'REPAIRER') navigate('/repairer/dashboard');
                  else if (r === 'RECYCLER') navigate('/recycler/dashboard');
                  else if (r === 'ADMIN') navigate('/admin');
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-zinc-950 font-semibold'
                    : 'bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-700/60'
                }`}
              >
                <span>{r}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Header Banner */}
      <div className="rounded-xl p-6 bg-zinc-900 border border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Recycle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-semibold text-xl text-zinc-100">
                  GreenCycle Circular Facility
                </h1>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                  ✓ R2v3 Certified
                </span>
              </div>
              <p className="text-xs font-mono text-zinc-400 mt-0.5">
                Peenya Industrial Zone • Hydrometallurgical E-Waste Smelting
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-zinc-800 font-mono">
          <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[10px] text-zinc-500 uppercase block">Pending Pickups</span>
            <span className="text-lg font-bold text-amber-400">{pendingRequests.length}</span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[10px] text-zinc-500 uppercase block">Logistics Fleet</span>
            <span className="text-lg font-bold text-zinc-100">{acceptedRequests.length}</span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[10px] text-zinc-500 uppercase block">Smelted & Certified</span>
            <span className="text-lg font-bold text-emerald-400">{verifiedRecoveries.length + 184}</span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[10px] text-zinc-500 uppercase block">Diversion Rate</span>
            <span className="text-lg font-bold text-zinc-100">99.8%</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-zinc-800 pb-2 font-mono text-xs">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            activeTab === 'requests'
              ? 'bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Dispatched Pickups ({pendingRequests.length + acceptedRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('collected')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            activeTab === 'collected'
              ? 'bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Certified End-of-Life Assets ({verifiedRecoveries.length})
        </button>
      </div>

      {/* Tab 1: Recovery Pickups */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {[...pendingRequests, ...acceptedRequests].length === 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-10 text-center text-zinc-500 font-mono text-xs">
              No pending recovery pickups.
            </div>
          ) : (
            [...pendingRequests, ...acceptedRequests].map((req) => (
              <div
                key={req.id}
                className="rounded-xl bg-zinc-900 border border-zinc-800 p-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                      Dispatch #{req.id.slice(-6).toUpperCase()}
                    </span>
                    <h3 className="font-display font-semibold text-base text-zinc-100">
                      {req.productName} ({req.productCode})
                    </h3>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded text-[11px] font-mono self-start sm:self-center ${
                      req.status === 'ACCEPTED'
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                    }`}
                  >
                    STATUS: {req.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3 bg-zinc-950/50 border border-zinc-800/80 rounded-lg">
                    <span className="text-[10px] text-zinc-500 block uppercase">Condition Report</span>
                    <span className="text-zinc-300">{req.condition}</span>
                  </div>
                  <div className="p-3 bg-zinc-950/50 border border-zinc-800/80 rounded-lg">
                    <span className="text-[10px] text-zinc-500 block uppercase">Pickup Address</span>
                    <span className="text-zinc-300 truncate block">{req.pickupAddress}</span>
                  </div>
                  <div className="p-3 bg-zinc-950/50 border border-zinc-800/80 rounded-lg">
                    <span className="text-[10px] text-zinc-500 block uppercase">Circular Value</span>
                    <span className="text-emerald-400 font-semibold">₹{req.estimatedValue}</span>
                  </div>
                </div>

                {req.status === 'REQUESTED' ? (
                  <button
                    onClick={() => handleAccept(req.id)}
                    className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Accept Pickup & Dispatch Logistics</span>
                  </button>
                ) : (
                  <div className="space-y-3 pt-1">
                    {/* Simulated Proof Upload */}
                    <div className="p-3.5 rounded-lg bg-zinc-950/60 border border-dashed border-zinc-700 flex items-center justify-between font-mono text-xs">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="text-zinc-200 font-medium">GreenCycle_Destruction_And_Smelt_Certificate_R2v3.pdf</div>
                          <div className="text-[10px] text-zinc-500">R2v3 Zero-Landfill Compliant • Proof of Smelt</div>
                        </div>
                      </div>
                      <span className="text-[11px] text-emerald-400">Ready to Mint ✓</span>
                    </div>

                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => handleVerify(req.id, req.productCode)}
                        className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify Recovery & Close Lifecycle</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Certified End of Life */}
      {activeTab === 'collected' && (
        <div className="space-y-3">
          {verifiedRecoveries.map((req) => (
            <div
              key={req.id}
              className="rounded-xl bg-zinc-900 border border-zinc-800 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 font-mono text-xs mb-1">
                  <span className="text-amber-400 font-medium">{req.productCode}</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-200">{req.productName}</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 text-[10px]">
                    ✓ End of Life Certified
                  </span>
                </div>
                <h4 className="font-display font-semibold text-zinc-100 text-sm">
                  R2v3 Closed Loop Smelting Verified
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Gold, copper and silicon recovered. Certificate of Destruction permanently appended.
                </p>
              </div>

              <Link
                to={`/passport/${req.productCode}`}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700 text-zinc-200 text-xs font-mono font-medium flex items-center gap-1.5 self-start sm:self-auto transition-colors"
              >
                <span>View Closed Passport</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
