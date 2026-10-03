import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { UserRole } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft,
  Mail, 
  Lock, 
  User as UserIcon, 
  ShieldCheck, 
  QrCode,
  Sparkles,
  Wrench,
  Recycle,
  Factory,
  CheckCircle2,
  Cpu,
  Layers,
  ExternalLink,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { Magnetic } from '../components/motion/Magnetic';

type PrimaryRoleChoice = 'CUSTOMER' | 'REPAIRER' | 'RECOVERY' | null;

export const AuthPage: React.FC = () => {
  const { setCurrentUser, switchRole } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Role selection step vs login form step
  const initialRoleParam = searchParams.get('role');
  const [selectedRole, setSelectedRole] = useState<PrimaryRoleChoice>(() => {
    if (initialRoleParam === 'customer') return 'CUSTOMER';
    if (initialRoleParam === 'repairer') return 'REPAIRER';
    if (initialRoleParam === 'recovery') return 'RECOVERY';
    return null; // Prompt requirement: First ask HOW ARE YOU USING REPATH?
  });

  const [hoveredRole, setHoveredRole] = useState<'CUSTOMER' | 'REPAIRER' | 'RECOVERY' | 'MANUFACTURER' | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Update default credential presets when role is selected
  const handleSelectRole = (role: 'CUSTOMER' | 'REPAIRER' | 'RECOVERY') => {
    setSelectedRole(role);
    if (role === 'CUSTOMER') {
      setEmail('owner@retrace.io');
    } else if (role === 'REPAIRER') {
      setEmail('techfix@retrace.io');
    } else if (role === 'RECOVERY') {
      setEmail('greencycle@retrace.io');
    }
  };

  const handleBackToRoles = () => {
    setSelectedRole(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (selectedRole === 'CUSTOMER') {
        switchRole('OWNER');
        navigate('/dashboard');
      } else if (selectedRole === 'REPAIRER') {
        switchRole('REPAIRER');
        navigate('/repairer/dashboard');
      } else if (selectedRole === 'RECOVERY') {
        switchRole('RECYCLER');
        navigate('/recycler/dashboard');
      } else {
        navigate('/dashboard');
      }
    }, 350);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (selectedRole === 'CUSTOMER') {
        switchRole('OWNER');
        navigate('/dashboard');
      } else if (selectedRole === 'REPAIRER') {
        switchRole('REPAIRER');
        navigate('/repairer/dashboard');
      } else if (selectedRole === 'RECOVERY') {
        switchRole('RECYCLER');
        navigate('/recycler/dashboard');
      }
    }, 350);
  };

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 select-none font-sans">
      
      <div className="relative z-10 w-full max-w-5xl mx-auto my-auto space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-900 shrink-0 group-hover:border-zinc-500 transition-colors shadow-sm">
              <img src="/retrace-logo.jpg" alt="ReTrace" className="w-full h-full object-cover scale-105" />
            </div>
            <span className="font-display font-bold text-lg tracking-wider text-zinc-100">
              RETRACE
            </span>
          </Link>
          <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            Circular Hardware Lifecycle Platform
          </div>
        </div>

        <AnimatePresence mode="wait">
          
          {/* =========================================================================
              PHASE 1: ROLE SELECTION CARDS
              "HOW ARE YOU USING RETRACE?"
              ========================================================================= */}
          {selectedRole === null ? (
            <motion.div
              key="role-selection"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-zinc-100 tracking-tight">
                  How are you using ReTrace?
                </h1>
                <p className="text-zinc-400 text-sm font-normal">
                  Select your portal identity to access hardware lifecycle tools and verified records.
                </p>
              </div>

              {/* 3 Interactive Choice Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. CUSTOMER CARD */}
                <div
                  onClick={() => handleSelectRole('CUSTOMER')}
                  className="rounded-xl p-5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 flex flex-col justify-between space-y-5 cursor-pointer transition-colors group"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/25 flex items-center justify-center text-amber-400">
                      <UserIcon className="w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="font-display font-semibold text-lg text-zinc-100">
                        Device Owner
                      </h3>
                      <p className="font-mono text-xs text-amber-400 font-medium">
                        Individual / Enterprise Customer
                      </p>
                    </div>

                    <ul className="space-y-1.5 text-xs font-mono text-zinc-400 pt-2 border-t border-zinc-800">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>Manage device passports</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>Find verified technicians</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>Secondary resale & transfer</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-2">
                    <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-300 group-hover:text-amber-400 transition-colors">
                      <span className="text-[11px]">Continue as Owner</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* 2. REPAIRER CARD */}
                <div
                  onClick={() => handleSelectRole('REPAIRER')}
                  className="rounded-xl p-5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 flex flex-col justify-between space-y-5 cursor-pointer transition-colors group"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200">
                      <Wrench className="w-5 h-5 text-amber-400" />
                    </div>

                    <div>
                      <h3 className="font-display font-semibold text-lg text-zinc-100">
                        Technician / Shop
                      </h3>
                      <p className="font-mono text-xs text-zinc-400 font-medium">
                        Authorized Service Partner
                      </p>
                    </div>

                    <ul className="space-y-1.5 text-xs font-mono text-zinc-400 pt-2 border-t border-zinc-800">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Manage workshop bench</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Accept incoming repairs</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Certify authenticated repairs</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-2">
                    <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-300 group-hover:text-amber-400 transition-colors">
                      <span className="text-[11px]">Continue as Repairer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* 3. RECOVERY PARTNER CARD */}
                <div
                  onClick={() => handleSelectRole('RECOVERY')}
                  className="rounded-xl p-5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 flex flex-col justify-between space-y-5 cursor-pointer transition-colors group"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200">
                      <Recycle className="w-5 h-5 text-emerald-400" />
                    </div>

                    <div>
                      <h3 className="font-display font-semibold text-lg text-zinc-100">
                        Recovery Partner
                      </h3>
                      <p className="font-mono text-xs text-zinc-400 font-medium">
                        Circularity & E-Waste Facility
                      </p>
                    </div>

                    <ul className="space-y-1.5 text-xs font-mono text-zinc-400 pt-2 border-t border-zinc-800">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Manage batch intake</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Component salvage tracking</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Issue smelting certificates</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-2">
                    <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-300 group-hover:text-amber-400 transition-colors">
                      <span className="text-[11px]">Continue as Recycler</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Optional Future OEM Manufacturer Option */}
              <div className="max-w-md mx-auto pt-2">
                <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/60 flex items-center justify-between text-xs font-mono text-zinc-500">
                  <div className="flex items-center gap-2.5">
                    <Factory className="w-4 h-4 text-zinc-600" />
                    <span>Manufacturer (OEM Batch Minting)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400 font-semibold">SOON</span>
                </div>
              </div>

              {/* Admin quick switch helper */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    switchRole('ADMIN');
                    navigate('/admin');
                  }}
                  className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Protocol Admin Governance Portal</span>
                </button>
              </div>
            </motion.div>
          ) : (
            
            /* =========================================================================
                PHASE 2: ROLE-SPECIFIC LOGIN INTERFACE
                ========================================================================= */
            <motion.div
              key="role-auth-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-md mx-auto w-full"
            >
              <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6 sm:p-7 space-y-5 shadow-lg">
                
                {/* Back to Role Selector */}
                <button
                  type="button"
                  onClick={handleBackToRoles}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Role</span>
                </button>

                {/* Role Header */}
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {selectedRole === 'CUSTOMER' && <UserIcon className="w-3 h-3 text-amber-400" />}
                    {selectedRole === 'REPAIRER' && <Wrench className="w-3 h-3 text-amber-400" />}
                    {selectedRole === 'RECOVERY' && <Recycle className="w-3 h-3 text-emerald-400" />}
                    <span className="font-medium uppercase">{selectedRole} PORTAL</span>
                  </div>

                  <h2 className="font-display font-bold text-xl sm:text-2xl text-zinc-100">
                    {selectedRole === 'CUSTOMER' && 'Owner Sign In'}
                    {selectedRole === 'REPAIRER' && 'Repairer Sign In'}
                    {selectedRole === 'RECOVERY' && 'Recovery Partner Sign In'}
                  </h2>

                  <p className="text-xs font-mono text-zinc-400">
                    {selectedRole === 'CUSTOMER' && 'Sign in to access your registered products & lifecycle passports.'}
                    {selectedRole === 'REPAIRER' && 'Sign in to manage your workshop bench & accept repair orders.'}
                    {selectedRole === 'RECOVERY' && 'Sign in to manage circular pickups & verify smelting certificates.'}
                  </p>
                </div>

                {/* Authentication Form */}
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {isSignUpMode && (
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-zinc-300 block">Full Name</label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Your Name"
                          required
                          className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-100 text-xs sm:text-sm focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-zinc-300 block">Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@retrace.io"
                        required
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-100 text-xs sm:text-sm font-mono focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono text-zinc-300">Password</label>
                      {selectedRole === 'CUSTOMER' && (
                        <button 
                          type="button"
                          onClick={() => alert('Password reset instructions dispatched to your email.')}
                          className="text-[11px] font-mono text-amber-400 hover:underline cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pl-9 pr-10 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-100 text-xs sm:text-sm font-mono focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                    ) : (
                      <>
                        <span>{isSignUpMode ? 'Create Account' : 'Sign In'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Continue with Google */}
                  {(selectedRole === 'CUSTOMER' || selectedRole === 'REPAIRER') && (
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="w-full py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-xs border border-zinc-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#EA4335"
                          d="M12 5c1.5 0 2.8.5 3.9 1.5l2.9-2.9C17 1.8 14.7 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.6 2.8C6.4 7.2 8.9 5 12 5z"
                        />
                        <path
                          fill="#4285F4"
                          d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.5 14.9c-.2-.7-.4-1.5-.4-2.4s.2-1.7.4-2.4L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.6-2.8z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.6-2.1-6.5-5.1L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </button>
                  )}
                </form>

                {/* Bottom Role-Tailored Links */}
                <div className="pt-2 border-t border-zinc-800 text-center font-mono text-xs">
                  {selectedRole === 'CUSTOMER' && (
                    <button
                      type="button"
                      onClick={() => setIsSignUpMode(!isSignUpMode)}
                      className="text-amber-400 hover:underline cursor-pointer"
                    >
                      {isSignUpMode ? 'Already have an account? Sign in' : 'Create new customer account'}
                    </button>
                  )}

                  {selectedRole === 'REPAIRER' && (
                    <Link
                      to="/repairer/register"
                      className="text-amber-400 hover:underline flex items-center justify-center gap-1.5"
                    >
                      <span>Register new repair shop</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}

                  {selectedRole === 'RECOVERY' && (
                    <Link
                      to="/recovery"
                      className="text-emerald-400 hover:underline flex items-center justify-center gap-1.5"
                    >
                      <span>Register as recovery partner</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
