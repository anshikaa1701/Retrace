import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import ParticleText from '../text/ParticleText';

export const Footer: React.FC = () => {
  const { currentUser } = useApp();
  const location = useLocation();

  // Horizontal primary nav links as specified
  const navLinks = [
    { label: 'ABOUT', href: '/about' },
    { label: 'HOW IT WORKS', href: '/how-it-works' },
    { label: 'FACILITIES', href: '/facilities' },
    { label: 'REPAIR', href: '/repair' },
    { label: 'RESELL', href: '/resale' },
    { label: 'RECOVER', href: '/recover' },
    { label: 'RECYCLING', href: '/recycling' },
    { label: 'CONTACT', href: '/contact' },
  ];

  // Role-aware authenticated quick links
  const getRoleLinks = () => {
    switch (currentUser.role) {
      case 'REPAIRER':
        return [
          { label: 'Repair Dashboard', href: '/repairer/dashboard' },
          { label: 'Repair Requests', href: '/repair-requests' },
          { label: 'Shop Profile', href: '/repairers/rep-techfix' },
          { label: 'Parts Catalog', href: '/parts' }
        ];
      case 'RECYCLER':
        return [
          { label: 'Recovery Dashboard', href: '/recycler/dashboard' },
          { label: 'Recovery Requests', href: '/recovery' },
          { label: 'Material Streams', href: '/recycling' }
        ];
      case 'ADMIN':
        return [
          { label: 'Protocol Governance', href: '/admin' },
          { label: 'Shop Approvals', href: '/admin' },
          { label: 'Audit Ledger', href: '/admin' }
        ];
      case 'OWNER':
      default:
        return [
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'My Products', href: '/products' },
          { label: 'Repair Requests', href: '/repair-requests' },
          { label: 'AI Assistant', href: '/ai-assistant' }
        ];
    }
  };

  const roleLinks = getRoleLinks();

  return (
    <footer className="w-full bg-[#070709] border-t border-zinc-800/80 text-zinc-400 font-sans relative overflow-hidden select-none">
      {/* Subtle top gradient glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 space-y-12">
        
        {/* =========================================================================
            1. AUTHENTICATED USER QUICK NAVIGATION (ROLE-AWARE)
            ========================================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-zinc-900 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-500 font-mono uppercase text-[11px] tracking-wider">
              PORTAL SESSION:
            </span>
            <span className="font-semibold text-zinc-300">
              {currentUser.role.charAt(0) + currentUser.role.slice(1).toLowerCase()} ({currentUser.name})
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-mono">
            {roleLinks.map((rl) => (
              <Link
                key={rl.label}
                to={rl.href}
                className="text-zinc-400 hover:text-amber-400 transition-colors flex items-center gap-1 group"
              >
                <span>{rl.label}</span>
                <span className="text-zinc-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all">→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* =========================================================================
            2. PRIMARY WORKING HORIZONTAL NAVIGATION ROW
            ABOUT | HOW IT WORKS | FACILITIES | REPAIR | RESELL | RECOVER | RECYCLING | CONTACT
            ========================================================================= */}
        <nav 
          aria-label="Footer Navigation"
          className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-10 lg:gap-x-12 gap-y-4 pt-2 text-center"
        >
          {navLinks.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`group relative py-1 text-[11px] sm:text-xs font-mono tracking-widest uppercase transition-all duration-300 ${
                  isActive 
                    ? 'text-white font-semibold' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                
                {/* Animated underline / short line */}
                <span 
                  className={`absolute bottom-0 left-0 h-[1.5px] bg-amber-400 transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} 
                />
              </Link>
            );
          })}
        </nav>

        {/* =========================================================================
            3. INTERACTIVE PARTICLE TEXT BRAND DISPLAY
            ========================================================================= */}
        <div className="relative pt-4 pb-2 text-center flex flex-col items-center justify-center">
          <Link 
            to="/" 
            className="block w-full max-w-2xl mx-auto cursor-pointer group"
            title="ReTrace Protocol"
          >
            <div className="w-full h-28 sm:h-36 relative">
              <ParticleText
                text="RETRACE"
                particleSize={2.2}
                density={3}
                color="#ffffff"
                highlightColor="#F59E0B"
                scatter={140}
                gatherDuration={1500}
                stagger={350}
                pointerRepel={45}
                repelRadius={110}
                idleDrift={0.6}
                trigger="hover"
                fontSize="clamp(2.5rem, 8vw, 4.5rem)"
                fontWeight={900}
                fontFamily="inherit"
                glow={true}
                className="w-full h-full"
                style={{ minHeight: '120px' }}
              />
            </div>
          </Link>
          <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.25em] text-zinc-500 pt-1">
            Give Every Product a Next Path.
          </p>
        </div>

        {/* =========================================================================
            4. FOOTER BOTTOM: COPYRIGHT & LEGAL ROUTES
            ========================================================================= */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© 2026 ReTrace. All rights reserved.</p>

          <div className="flex items-center gap-6 text-zinc-400 text-xs font-sans">
            <Link 
              to="/privacy" 
              className="hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Privacy Policy
            </Link>
            <span className="text-zinc-700">•</span>
            <Link 
              to="/terms" 
              className="hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
