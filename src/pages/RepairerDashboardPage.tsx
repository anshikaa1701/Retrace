import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wrench,
  CheckCircle2,
  Clock,
  FileText,
  Upload,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  TrendingUp,
  User,
  DollarSign,
  AlertCircle,
  Plus,
  Edit3,
  ExternalLink,
  MapPin,
  Star,
  Cpu,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RepairerDashboardPage: React.FC = () => {
  const {
    currentUser,
    switchRole,
    repairRequests,
    acceptRepairRequest,
    declineRepairRequest,
    completeRepair,
    verifyRepair,
    repairers,
    updateRepairShop,
    getRepairerReviews,
    products
  } = useApp();

  const navigate = useNavigate();

  // Find repair shop corresponding to this user or fallback to TechFix
  const myShop = repairers.find(r => r.userId === currentUser.id || r.id === 'rep-techfix') || repairers[0];
  const reviews = getRepairerReviews(myShop.id);

  // Active tab inside repairer portal
  const [activeTab, setActiveTab] = useState<'requests' | 'active' | 'completed' | 'reviews'>('requests');
  const [verifyingReqId, setVerifyingReqId] = useState<string | null>(null);
  const [workDoneText, setWorkDoneText] = useState('Dual-fan assembly replaced and Arctic MX-6 thermal compound applied. Heatsink ultrasonic bath cleared all particulate blockage.');
  const [selectedParts, setSelectedParts] = useState(['Dell OEM Dual-Fan Assembly (DL-FAN-5510)', 'Arctic MX-6 Thermal Compound']);
  const [finalCost, setFinalCost] = useState(3000);
  const [isEditingShop, setIsEditingShop] = useState(false);
  const [editAvailability, setEditAvailability] = useState(myShop.availability || 'OPEN');
  const [editHours, setEditHours] = useState(myShop.openingHours || 'Mon–Sat: 10:00 AM – 8:00 PM');

  const incomingRequests = repairRequests.filter(r => r.status === 'REQUESTED');
  const activeRepairs = repairRequests.filter(r => r.status === 'ACCEPTED' || r.status === 'IN_REPAIR');
  const completedRepairs = repairRequests.filter(r => r.status === 'COMPLETED' || r.status === 'VERIFIED');

  const handleAccept = (reqId: string) => {
    acceptRepairRequest(reqId);
    setActiveTab('active');
  };

  const handleDecline = (reqId: string) => {
    declineRepairRequest(reqId);
  };

  const handleMarkComplete = (reqId: string) => {
    completeRepair(reqId, {
      workDone: workDoneText,
      partsUsed: selectedParts,
      finalCost: Number(finalCost),
      invoiceName: 'TechFix_Authorized_Thermal_Overhaul_INV-99812.pdf'
    });
    setVerifyingReqId(reqId);
  };

  const handleVerify = (reqId: string, productCode: string) => {
    verifyRepair(reqId, 'TechFix_Authorized_Thermal_Overhaul_INV-99812.pdf');
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.3 },
      colors: ['#10B981', '#06B6D4', '#ffffff']
    });

    setVerifyingReqId(null);
    setActiveTab('completed');
  };

  const handleSaveShopEdit = () => {
    updateRepairShop(myShop.id, {
      availability: editAvailability as any,
      openingHours: editHours
    });
    setIsEditingShop(false);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 font-sans">

      {/* Universal Quick Role Switcher Bar */}
      <div className="p-2 sm:p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 pl-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
            Active Role: <strong className="text-zinc-200">REPAIRER ({myShop.name})</strong>
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
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${isActive
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

      {/* Header Banner & Portal Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Technician Portal</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-zinc-100">
            Workshop Command Hub
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Manage bench work orders • Emit cryptographic passport updates
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/repairer/register"
            className="px-3.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Repair Shop</span>
          </Link>

          <button
            onClick={() => setIsEditingShop(!isEditingShop)}
            className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-xs font-medium border border-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-zinc-400" />
            <span>Edit Shop</span>
          </button>

          <Link
            to={`/repairers/${myShop.id}`}
            className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-xs border border-zinc-700 flex items-center gap-1.5 transition-colors"
          >
            <span>Public Profile</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </Link>
        </div>
      </div>

      {/* Profile Card */}
      <div className="rounded-xl p-5 sm:p-6 bg-zinc-900 border border-zinc-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

          {/* Shop Photo + Info */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative flex-shrink-0">
              <img
                src={myShop.avatar || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300'}
                alt={myShop.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border border-zinc-700"
              />
              <span className={`absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${myShop.availability === 'OPEN'
                  ? 'bg-emerald-500 text-zinc-950'
                  : 'bg-zinc-700 text-zinc-200'
                }`}>
                {myShop.availability || 'OPEN'}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display font-bold text-xl text-zinc-100">
                  {myShop.name}
                </h2>

                {myShop.verificationStatus === 'VERIFIED' ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>✓ Verified</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/25 text-[10px] font-mono">
                    Pending Verification
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 flex-wrap">
                <span className="text-amber-400 font-medium">{myShop.specialty}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-zinc-500" />
                  <span>{myShop.city || myShop.location}</span>
                </span>
                <span>•</span>
                <span>Lead: {myShop.ownerName}</span>
              </div>

              <div className="flex items-center gap-1.5 pt-0.5">
                {(myShop.specializations || ['Dell', 'HP', 'Lenovo']).map((spec) => (
                  <span
                    key={spec}
                    className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px] font-mono"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Metrics Pill Block */}
          <div className="flex items-center gap-4 bg-zinc-950/60 p-3 rounded-lg border border-zinc-800 flex-shrink-0">
            <div className="text-center px-2">
              <div className="flex items-center justify-center gap-1 text-amber-400 font-mono text-base font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{myShop.rating > 0 ? myShop.rating.toFixed(1) : 'New'}</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">RATING</span>
            </div>

            <div className="w-[1px] h-6 bg-zinc-800" />

            <div className="text-center px-2">
              <span className="font-display font-semibold text-base text-zinc-100 block">
                {myShop.reviewCount}
              </span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">REVIEWS</span>
            </div>

            <div className="w-[1px] h-6 bg-zinc-800" />

            <div className="text-center px-2">
              <span className="font-display font-semibold text-base text-emerald-400 block">
                {myShop.completedRepairs}
              </span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">COMPLETED</span>
            </div>
          </div>
        </div>

        {/* Inline Edit Form toggle */}
        {isEditingShop && (
          <div className="mt-5 pt-5 border-t border-zinc-800 space-y-3">
            <div className="font-mono text-xs text-amber-400 font-semibold uppercase">
              Quick Shop Settings
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-400">AVAILABILITY</label>
                <select
                  value={editAvailability}
                  onChange={(e) => setEditAvailability(e.target.value as any)}
                  className="w-full p-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-100 text-xs font-mono"
                >
                  <option value="OPEN">OPEN (Accepting Repairs)</option>
                  <option value="BUSY">BUSY (Delayed Turnaround)</option>
                  <option value="CLOSED">CLOSED (Not Accepting)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-400">OPENING HOURS</label>
                <input
                  type="text"
                  value={editHours}
                  onChange={(e) => setEditHours(e.target.value)}
                  className="w-full p-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-100 text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingShop(false)}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 font-mono text-xs cursor-pointer hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveShopEdit}
                className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono font-semibold text-xs cursor-pointer"
              >
                Save Updates
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-zinc-800 pb-2 font-mono text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${activeTab === 'requests'
              ? 'bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
            }`}
        >
          Repair Requests ({incomingRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${activeTab === 'active'
              ? 'bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
            }`}
        >
          Active Repairs ({activeRepairs.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${activeTab === 'completed'
              ? 'bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
            }`}
        >
          Completed & Verified ({completedRepairs.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${activeTab === 'reviews'
              ? 'bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
            }`}
        >
          Customer Reviews ({reviews.length})
        </button>
      </div>

      {/* Tab 1: Repair Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-3">
          {incomingRequests.length === 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-8 text-center text-zinc-500 font-mono text-xs">
              No pending incoming repair requests at this time.
            </div>
          ) : (
            incomingRequests.map((req) => (
              <div
                key={req.id}
                className="rounded-xl bg-zinc-900 border border-zinc-800 p-5 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="font-mono text-xs font-semibold text-amber-400 uppercase">
                      New Incoming Repair Request
                    </span>
                  </div>
                  <span className="text-zinc-500 font-mono text-xs">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column: Product & Issue */}
                  <div className="space-y-2.5 font-mono text-xs">
                    <div>
                      <span className="text-zinc-500 uppercase text-[10px] block">Product</span>
                      <h3 className="font-display font-semibold text-base text-zinc-100 mt-0.5">
                        {req.productName}
                      </h3>
                    </div>

                    <div>
                      <span className="text-zinc-500 uppercase text-[10px] block">Product ID</span>
                      <span className="text-amber-400 font-semibold text-sm">{req.productCode}</span>
                    </div>

                    <div>
                      <span className="text-zinc-500 uppercase text-[10px] block">Reported Issue</span>
                      <span className="text-zinc-200 font-medium">{req.issue}</span>
                      <p className="text-zinc-400 text-xs font-sans mt-0.5">
                        &ldquo;{req.description}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Right Column: AI Assessment */}
                  <div className="space-y-2.5 font-mono text-xs">
                    <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-zinc-300 font-semibold text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>AI Diagnostic Assessment</span>
                      </div>
                      <p className="text-zinc-400 text-xs font-sans">
                        {req.issue.toLowerCase().includes('overheat') || req.issue.toLowerCase().includes('thermal')
                          ? 'Possible thermal/cooling issue. Recommend dual-fan RPM test, heatsink particulate clearance, and OEM thermal paste re-application.'
                          : 'Hardware diagnostics recommended. Component testing required for logic power rail and peripheral bus.'}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800 text-zinc-400 text-xs space-y-0.5">
                      <div className="flex items-center justify-between text-zinc-300">
                        <span>Customer Location:</span>
                        <strong className="text-emerald-400">Approx. 1.5 km away</strong>
                      </div>
                      <p className="text-[10px] text-zinc-500">
                        Exact private address shielded until ticket is accepted.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons: [ ACCEPT ] [ DECLINE ] */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-800">
                  <button
                    onClick={() => handleDecline(req.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs border border-zinc-700 transition-colors cursor-pointer"
                  >
                    Decline
                  </button>

                  <button
                    onClick={() => handleAccept(req.id)}
                    className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Accept Repair</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Active Repairs on Bench */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          {activeRepairs.length === 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-8 text-center text-zinc-500 font-mono text-xs">
              No active work tickets currently on the bench.
            </div>
          ) : (
            activeRepairs.map((req) => (
              <div
                key={req.id}
                className="rounded-xl bg-zinc-900 border border-zinc-800 p-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3 font-mono text-xs">
                  <div>
                    <span className="text-amber-400 font-semibold">{req.productCode}</span> • <span className="text-zinc-200">{req.productName}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px]">
                    Status: In Diagnostic / Teardown
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1 font-mono text-xs">
                    <label className="text-zinc-400">Work Performed & Bench Logs</label>
                    <textarea
                      rows={2}
                      value={workDoneText}
                      onChange={(e) => setWorkDoneText(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-100 text-xs font-sans focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                    <div className="space-y-1">
                      <label className="text-zinc-400">Final Verified Cost (₹)</label>
                      <input
                        type="number"
                        value={finalCost}
                        onChange={(e) => setFinalCost(Number(e.target.value))}
                        className="w-full p-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-100 text-xs font-mono focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-zinc-400">Bench Invoice Proof</label>
                      <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-700 text-[11px] text-emerald-400 flex items-center justify-between">
                        <span>TechFix_Thermal_Overhaul_INV-99812.pdf</span>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                  <button
                    onClick={() => handleMarkComplete(req.id)}
                    className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Mark Repair Completed</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Completed & Verified Orders */}
      {activeTab === 'completed' && (
        <div className="space-y-3">
          {completedRepairs.length === 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-8 text-center text-zinc-500 font-mono text-xs">
              No completed work orders recorded yet.
            </div>
          ) : (
            completedRepairs.map((req) => (
              <div
                key={req.id}
                className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 space-y-3"
              >
                <div className="flex items-center justify-between font-mono text-xs border-b border-zinc-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-semibold">{req.productCode}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-200 font-medium">{req.productName}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-semibold">
                    ✓ Verified
                  </span>
                </div>

                <div className="text-xs font-mono text-zinc-300">
                  <span className="text-zinc-500">Work Log: </span>
                  {req.completedDetails?.workDone || 'Cooling system rebuild, Arctic MX-6 applied.'}
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-2 border-t border-zinc-800/80">
                  <span>Total Cost: ₹{req.completedDetails?.finalCost || 3000}</span>
                  <Link
                    to={`/passport/${req.productCode}`}
                    className="text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>Inspect Updated Digital Passport</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 4: Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-3">
          {reviews.length === 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-8 text-center text-zinc-500 font-mono text-xs">
              No customer reviews received yet.
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 space-y-2 font-mono text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-semibold text-zinc-100 text-sm">
                      {rev.ownerName}
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      ✓ Verified Work Order
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{rev.rating}.0 ★</span>
                  </div>
                </div>
                <p className="text-zinc-300 font-sans text-xs leading-relaxed">
                  &ldquo;{rev.review}&rdquo;
                </p>
                <div className="text-[10px] text-zinc-500">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};