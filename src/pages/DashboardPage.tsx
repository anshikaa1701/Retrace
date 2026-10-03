import React from 'react';
import { useApp } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { StatusBadge, ConditionBadge } from '../components/common/Badges';
import { UserRole } from '../types';
import { 
  Layers, 
  Wrench, 
  ShieldCheck, 
  ShoppingBag, 
  Recycle, 
  Plus, 
  QrCode, 
  ArrowRight, 
  Sparkles,
  ExternalLink,
  Cpu,
  User,
  CheckCircle2,
  Search
} from 'lucide-react';

// Sub-dashboards for other roles
import { RepairerDashboardPage } from './RepairerDashboardPage';
import { RecyclerDashboardPage } from './RecyclerDashboardPage';
import { AdminPage } from './AdminPage';

export const DashboardPage: React.FC = () => {
  const { products, currentUser, repairRequests, switchRole } = useApp();
  const navigate = useNavigate();

  // If the active role is not OWNER, delegate to the dedicated dashboard view
  if (currentUser.role === 'REPAIRER') {
    return <RepairerDashboardPage />;
  }

  if (currentUser.role === 'RECYCLER') {
    return <RecyclerDashboardPage />;
  }

  if (currentUser.role === 'ADMIN') {
    return <AdminPage />;
  }

  const activeRepairsCount = repairRequests.filter(
    r => r.status === 'REQUESTED' || r.status === 'ACCEPTED' || r.status === 'IN_REPAIR'
  ).length;
  const totalVerifiedRepairs = products.reduce((acc, p) => acc + p.verifiedRepairsCount, 0);
  const resoldProductsCount = products.filter(p => p.lifecycleStatus === 'RESOLD').length;
  const recoveredProductsCount = products.filter(
    p => p.lifecycleStatus === 'IN_RECOVERY' || p.lifecycleStatus === 'END_OF_LIFE'
  ).length;

  const handleRoleTabClick = (role: UserRole) => {
    switchRole(role);
    if (role === 'REPAIRER') navigate('/repairer/dashboard');
    else if (role === 'RECYCLER') navigate('/recycler/dashboard');
    else if (role === 'ADMIN') navigate('/admin');
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Universal Quick Role Switcher Bar */}
      <div className="p-2 sm:p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 pl-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
            Active Role: <strong className="text-zinc-200">{currentUser.role}</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {(['OWNER', 'REPAIRER', 'RECYCLER', 'ADMIN'] as const).map((r) => {
            const isActive = currentUser.role === r;
            return (
              <button
                key={r}
                onClick={() => handleRoleTabClick(r)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-zinc-950 font-semibold'
                    : 'bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-700/60'
                }`}
              >
                {r === 'OWNER' && <User className="w-3.5 h-3.5" />}
                {r === 'REPAIRER' && <Wrench className="w-3.5 h-3.5" />}
                {r === 'RECYCLER' && <Recycle className="w-3.5 h-3.5" />}
                {r === 'ADMIN' && <ShieldCheck className="w-3.5 h-3.5" />}
                <span>{r}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Header Banner */}
      <div className="rounded-xl p-5 sm:p-6 bg-zinc-900 border border-zinc-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Owner Portal</span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-zinc-100">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-xs font-mono text-zinc-400 mt-1">
              Account: {currentUser.email} • Hardware assets under management
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/scan"
              className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 hover:text-white border border-zinc-700 flex items-center gap-1.5 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-400" />
              <span>Scan QR</span>
            </Link>

            <Link
              to="/products/new"
              className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Product</span>
            </Link>
          </div>
        </div>

        {/* Top 5 Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-5 border-t border-zinc-800 font-mono">
          <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[10px] text-zinc-400 uppercase block">Registered Products</span>
            <span className="text-xl font-bold text-zinc-100">{products.length}</span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[10px] text-zinc-400 uppercase block">Active Repairs</span>
            <span className="text-xl font-bold text-amber-400">{activeRepairsCount}</span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[10px] text-zinc-400 uppercase block">Verified Repairs</span>
            <span className="text-xl font-bold text-emerald-400">{totalVerifiedRepairs}</span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[10px] text-zinc-400 uppercase block">Products Resold</span>
            <span className="text-xl font-bold text-zinc-200">{resoldProductsCount}</span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[10px] text-zinc-400 uppercase block">Recovered</span>
            <span className="text-xl font-bold text-zinc-200">{recoveredProductsCount}</span>
          </div>
        </div>
      </div>

      {/* 3 Prominent Actions with Explicit Distinction matching prompt */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* 1. ADD PRODUCT */}
        <div className="rounded-xl p-5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/25 flex items-center justify-center text-amber-400">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="font-display font-semibold text-base text-zinc-100">
              Register Hardware
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-mono">
              Register a device manually and issue its decentralized digital passport.
            </p>
          </div>

          <Link
            to="/products/new"
            className="w-full py-2 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>+ Register New Device</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 2. SCAN RETRACE QR */}
        <div className="rounded-xl p-5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200">
              <QrCode className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="font-display font-semibold text-base text-zinc-100">
              Scan ReTrace QR
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-mono">
              Inspect an existing passport via physical or digital QR code.
            </p>
          </div>

          <Link
            to="/scan"
            className="w-full py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono font-medium text-xs flex items-center justify-center gap-1.5 border border-zinc-700 transition-colors"
          >
            <QrCode className="w-3.5 h-3.5 text-amber-400" />
            <span>Open QR Scanner</span>
          </Link>
        </div>

        {/* 3. ENTER PRODUCT ID */}
        <div className="rounded-xl p-5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
              <Search className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="font-display font-semibold text-base text-zinc-100">
              Lookup by ID
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-mono">
              Direct lookup by ReTrace identifier (e.g. RP-DL-72891).
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const target = (e.currentTarget.elements.namedItem('idInput') as HTMLInputElement).value.trim();
              if (target) navigate(`/passport/${target.toUpperCase()}`);
            }}
            className="flex items-center gap-2"
          >
            <input
              name="idInput"
              type="text"
              placeholder="RP-DL-72891"
              className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-100 font-mono text-xs focus:border-amber-400 focus:outline-none uppercase"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-amber-400 hover:text-zinc-950 text-zinc-200 font-mono text-xs font-medium border border-zinc-700 transition-colors cursor-pointer"
            >
              Find
            </button>
          </form>
        </div>
      </div>

      {/* Products Fleet Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
              Fleet Overview
            </span>
            <h2 className="font-display font-bold text-lg text-zinc-100">
              My Registered Devices
            </h2>
          </div>

          <span className="text-xs font-mono text-zinc-400">
            {products.length} Active Passports
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-xl p-5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col justify-between group"
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="font-mono text-xs font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    {product.productId}
                  </span>
                  <StatusBadge status={product.lifecycleStatus} size="sm" />
                </div>

                {/* Device Title */}
                <span className="text-[11px] font-mono text-zinc-400 uppercase block">
                  {product.brand} • {product.category}
                </span>
                <h3 className="font-display font-semibold text-base text-zinc-100 group-hover:text-amber-400 transition-colors mb-2">
                  {product.model}
                </h3>

                {/* Badges strip */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
                  <ConditionBadge condition={product.condition} />
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {product.verifiedRepairsCount} verified repairs
                  </span>
                </div>

                {/* Specs snapshot */}
                <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80 font-mono text-[11px] text-zinc-300 space-y-1 mb-4">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Repairability:</span>
                    <span className="text-emerald-400 font-semibold">{product.repairabilityScore} / 10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Est. Resale:</span>
                    <span className="text-zinc-200">₹{product.estimatedResaleMin.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Registered:</span>
                    <span className="text-zinc-400">{product.purchaseDate}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800">
                <Link
                  to={`/passport/${product.productId}`}
                  className="py-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 hover:text-white font-mono text-xs font-medium flex items-center justify-center gap-1.5 transition-colors text-center"
                >
                  <span>Passport</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to={`/ai-assistant?code=${product.productId}&prompt=overheating`}
                  className="py-1.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 font-mono text-xs font-medium flex items-center justify-center gap-1.5 transition-colors text-center border border-zinc-800"
                >
                  <Cpu className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ask AI</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
