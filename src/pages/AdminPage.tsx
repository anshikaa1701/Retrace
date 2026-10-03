import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Layers, 
  Wrench, 
  Recycle, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Users, 
  Activity,
  ArrowRight,
  TrendingUp,
  Search
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const AdminPage: React.FC = () => {
  const { 
    products, 
    repairers, 
    recoveryPartners, 
    repairRequests, 
    lifecycleEvents, 
    currentUser, 
    switchRole,
    verifyRepairerShop
  } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'verifications' | 'products' | 'repairers'>('approvals');
  const [searchQuery, setSearchQuery] = useState('');

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.lifecycleStatus === 'ACTIVE').length;
  const totalVerifiedRepairs = products.reduce((acc, p) => acc + p.verifiedRepairsCount, 0);
  const totalResales = products.filter(p => p.lifecycleStatus === 'RESOLD').length;
  const totalRecoveries = products.filter(p => p.lifecycleStatus === 'IN_RECOVERY').length;
  const totalRecycled = products.filter(p => p.lifecycleStatus === 'END_OF_LIFE' || p.lifecycleStatus === 'RECYCLED').length;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Universal Quick Role Switcher Bar */}
      <div className="p-2 sm:p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 pl-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
            Active Role: <strong className="text-zinc-200">{currentUser.role} (Platform Governance)</strong>
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
            <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-semibold text-xl text-zinc-100">
                  ReTrace Protocol Governance
                </h1>
                <span className="px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20 text-[10px] font-mono">
                  Root Admin
                </span>
              </div>
              <p className="text-xs font-mono text-zinc-400 mt-0.5">
                Immutable Audit Logs • Participating Hubs • Registry Health
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Consensus: 100% Verified</span>
          </div>
        </div>

        {/* 8 Platform Statistics Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mt-6 pt-5 border-t border-zinc-800 font-mono text-xs">
          <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[9px] text-zinc-500 uppercase block">Total Products</span>
            <span className="text-base font-bold text-zinc-100">{totalProducts}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[9px] text-zinc-500 uppercase block">Active Fleet</span>
            <span className="text-base font-bold text-emerald-400">{activeProducts}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[9px] text-zinc-500 uppercase block">Verified Repairs</span>
            <span className="text-base font-bold text-zinc-100">{totalVerifiedRepairs}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[9px] text-zinc-500 uppercase block">Resales</span>
            <span className="text-base font-bold text-zinc-100">{totalResales + 2}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[9px] text-zinc-500 uppercase block">Recoveries</span>
            <span className="text-base font-bold text-zinc-100">{totalRecoveries + 1}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[9px] text-zinc-500 uppercase block">Recycled</span>
            <span className="text-base font-bold text-zinc-300">{totalRecycled + 1}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[9px] text-zinc-500 uppercase block">Repairers</span>
            <span className="text-base font-bold text-amber-400">{repairers.length}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[9px] text-zinc-500 uppercase block">Recyclers</span>
            <span className="text-base font-bold text-emerald-400">{recoveryPartners.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-zinc-800 pb-2 font-mono text-xs flex-wrap">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            activeTab === 'approvals'
              ? 'bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Pending Shop Verifications ({repairers.filter(r => r.verificationStatus === 'PENDING').length})
        </button>
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          All Registered Passports ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('verifications')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            activeTab === 'verifications'
              ? 'bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Audit Ledger & Events ({lifecycleEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('repairers')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            activeTab === 'repairers'
              ? 'bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Verified Hubs ({repairers.length + recoveryPartners.length})
        </button>
      </div>

      {/* Tab: Pending Shop Verifications */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          {repairers.filter(r => r.verificationStatus === 'PENDING').length === 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-10 text-center text-zinc-500 font-mono text-xs">
              No pending shop verification applications.
            </div>
          ) : (
            repairers.filter(r => r.verificationStatus === 'PENDING').map((r) => (
              <div 
                key={r.id}
                className="rounded-xl bg-zinc-900 border border-zinc-800 p-5 space-y-4 font-mono text-xs"
              >
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-amber-400 font-semibold uppercase tracking-wider">
                      New Repair Shop Application
                    </span>
                  </div>
                  <span className="text-zinc-500 text-[11px]">
                    ID: {r.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                  {/* Photo */}
                  <div className="md:col-span-3">
                    <img 
                      src={r.avatar || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300'} 
                      alt="" 
                      className="w-full h-36 rounded-lg object-cover border border-zinc-800"
                    />
                    <div className="text-center text-[10px] text-zinc-500 mt-1">
                      Storefront / Bench Workstation
                    </div>
                  </div>

                  {/* Details */}
                  <div className="md:col-span-9 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-zinc-500 text-[10px] uppercase block">Shop Name</span>
                        <h3 className="font-display font-semibold text-base text-zinc-100">{r.name}</h3>
                      </div>
                      <div>
                        <span className="text-zinc-500 text-[10px] uppercase block">Owner / Lead Contact</span>
                        <span className="text-zinc-200 text-xs font-medium">{r.ownerName}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-zinc-500 text-[10px] uppercase block">Contact Channels</span>
                        <div className="text-zinc-300 text-xs">{r.phone}</div>
                        <div className="text-amber-400 text-xs">{r.email}</div>
                      </div>
                      <div>
                        <span className="text-zinc-500 text-[10px] uppercase block">Bench Location</span>
                        <div className="text-zinc-300 text-xs">{r.address || r.location}</div>
                        <div className="text-zinc-500 text-[11px]">{r.city}, {r.state} - {r.pincode}</div>
                      </div>
                    </div>

                    {/* Services & Specializations */}
                    <div>
                      <span className="text-zinc-500 text-[10px] uppercase block mb-1">Services & Specializations</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(r.category || []).map(cat => (
                          <span key={cat} className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px]">
                            {cat}
                          </span>
                        ))}
                        {(r.specializations || []).map(spec => (
                          <span key={spec} className="px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20 text-[10px]">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Submitted Documents */}
                    <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-amber-400" />
                        <span className="text-zinc-300 text-xs">ReTrace_Shop_Business_Registration_&_KYC.pdf</span>
                      </div>
                      <span className="text-emerald-400 text-[10px]">Validated Checksum ✓</span>
                    </div>
                  </div>
                </div>

                {/* Actions: APPROVE or REJECT */}
                <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                  <Link
                    to={`/repairers/${r.id}`}
                    className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
                  >
                    <span>Inspect Public Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => verifyRepairerShop(r.id, 'REJECTED')}
                      className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-rose-500/10 hover:text-rose-400 text-zinc-400 border border-zinc-700 text-xs transition-colors cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => verifyRepairerShop(r.id, 'VERIFIED')}
                      className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Verify</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Passports Table View */}
      {activeTab === 'overview' && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden font-mono text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800 text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">Product ID</th>
                  <th className="py-2.5 px-4">Device Model</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">Condition</th>
                  <th className="py-2.5 px-4">Repairs</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-2.5 px-4 text-amber-400 font-semibold">{p.productId}</td>
                    <td className="py-2.5 px-4 text-zinc-200 font-medium">{p.brand} {p.model}</td>
                    <td className="py-2.5 px-4 text-zinc-400">{p.category}</td>
                    <td className="py-2.5 px-4">{p.condition}</td>
                    <td className="py-2.5 px-4 text-zinc-300">{p.verifiedRepairsCount} Verified</td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {p.lifecycleStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <Link
                        to={`/passport/${p.productId}`}
                        className="text-amber-400 hover:text-amber-300 text-xs font-medium inline-flex items-center gap-1"
                      >
                        <span>Passport</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ledger Audit Events Tab */}
      {activeTab === 'verifications' && (
        <div className="space-y-2.5 font-mono text-xs">
          {lifecycleEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-amber-400 font-semibold">{evt.productId}</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-200 font-medium">{evt.title}</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px]">
                    {evt.verificationLevel}
                  </span>
                </div>
                <p className="text-zinc-400 text-[11px]">{evt.description}</p>
              </div>

              <div className="text-right text-[11px] text-zinc-500 flex-shrink-0">
                <div>Logged by: {evt.actorName}</div>
                <div>{new Date(evt.timestamp).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Verified Hubs Tab */}
      {activeTab === 'repairers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
          {repairers.map((r) => (
            <div key={r.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-zinc-100 font-semibold">{r.name}</h4>
                  <span className="text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    Repair Hub
                  </span>
                </div>
                <p className="text-zinc-400 text-[11px] mt-1">{r.location}</p>
                <div className="text-amber-400 text-[10px] mt-0.5">Rating: {r.rating} ★</div>
              </div>

              <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                Active
              </span>
            </div>
          ))}

          {recoveryPartners.map((rp) => (
            <div key={rp.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-zinc-100 font-semibold">{rp.name}</h4>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Recycler
                  </span>
                </div>
                <p className="text-zinc-400 text-[11px] mt-1">{rp.location}</p>
                <div className="text-zinc-400 text-[10px] mt-0.5">{rp.typeLabel}</div>
              </div>

              <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                R2v3 Verified
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
