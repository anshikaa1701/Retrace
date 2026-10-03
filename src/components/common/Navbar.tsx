import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  QrCode, 
  Bell, 
  Menu, 
  X, 
  ChevronDown, 
  ArrowRight,
  Check
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, switchRole, notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { label: 'Products', href: '/products', sectionId: 'passport' },
    { label: 'AI Diagnostic', href: '/ai-assistant', sectionId: 'ai-assessment' },
    { label: 'Repairers', href: '/repairers', sectionId: 'top-repairers' },
    { label: 'Resale', href: '/resale', sectionId: 'resale' },
    { label: 'Recovery', href: '/recovery', sectionId: 'recovery' },
  ];

  const handleNavClick = (e: React.MouseEvent, item: typeof navItems[0]) => {
    if (location.pathname === '/' && item.sectionId) {
      const el = document.getElementById(item.sectionId);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
  };

  const getDashboardPath = (role: UserRole) => {
    switch (role) {
      case 'REPAIRER':
        return '/repairer/dashboard';
      case 'RECYCLER':
        return '/recycler/dashboard';
      case 'ADMIN':
        return '/admin';
      case 'OWNER':
      default:
        return '/dashboard';
    }
  };

  const handleRoleSelect = (r: UserRole) => {
    switchRole(r);
    setRoleDropdownOpen(false);
    navigate(getDashboardPath(r));
  };

  // Capitalize role for standard SaaS display
  const formattedRole = currentUser.role.charAt(0) + currentUser.role.slice(1).toLowerCase();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-[#09090b]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* LEFT: ReTrace Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-zinc-700/80 bg-zinc-900 shrink-0 group-hover:border-zinc-500 transition-colors shadow-sm">
              <img
                src="/retrace-logo.jpg"
                alt="ReTrace"
                className="w-full h-full object-cover scale-105"
              />
            </div>
            <span className="font-sans font-bold text-lg tracking-tight text-white group-hover:text-zinc-200 transition-colors">
              RETRACE
            </span>
            <span className="text-[10px] font-sans font-semibold tracking-wide px-1.5 py-0.5 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700/70">
              BETA
            </span>
          </Link>
        </div>

        {/* CENTER: Grouped Navigation Container */}
        <nav className="hidden md:flex items-center p-1 rounded-lg bg-zinc-900/80 border border-zinc-800/80 shadow-sm">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`px-3.5 py-1.5 rounded-md text-[13px] font-medium transition-all ${
                  isActive 
                    ? 'text-white bg-zinc-800 font-medium shadow-xs' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT: Grouped Utility Actions + Primary CTA */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative h-9 w-9 flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800/70 text-zinc-400 hover:text-zinc-200 transition-colors"
              title="Notifications"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-zinc-900" />
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl p-3 z-50 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <span className="text-xs font-semibold text-zinc-200">Notifications</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-amber-400 hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1.5">
                  {notifications.slice(0, 4).map((n) => (
                    <div 
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                        n.read ? 'bg-zinc-950/40 text-zinc-400' : 'bg-zinc-800 text-zinc-200'
                      }`}
                    >
                      <div className="font-medium text-white">{n.title}</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">{n.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Role Selector: Clean SaaS Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="h-9 flex items-center gap-1.5 px-3 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 text-xs font-medium text-zinc-300 transition-colors cursor-pointer"
              title="Switch demo role"
            >
              <span className="text-zinc-400">Role:</span>
              <span className="font-semibold text-zinc-100">{formattedRole}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500 ml-0.5" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl p-1 z-50 text-xs space-y-0.5">
                <div className="px-2.5 py-1 text-[11px] font-medium text-zinc-400 border-b border-zinc-800/80 mb-1">
                  Active Role
                </div>
                {(['OWNER', 'REPAIRER', 'RECYCLER', 'ADMIN'] as const).map((r) => {
                  const label = r.charAt(0) + r.slice(1).toLowerCase();
                  return (
                    <button
                      key={r}
                      onClick={() => handleRoleSelect(r)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        currentUser.role === r
                          ? 'bg-zinc-800 text-amber-400 font-medium'
                          : 'text-zinc-300 hover:bg-zinc-800/60'
                      }`}
                    >
                      <span>{label}</span>
                      {currentUser.role === r && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Secondary Action: Scan QR Button */}
          <Link
            to="/scan"
            className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition-colors"
          >
            <QrCode className="w-3.5 h-3.5 text-zinc-400" />
            <span>Scan QR</span>
          </Link>

          {/* Primary CTA: Dashboard Button */}
          <Link
            to={getDashboardPath(currentUser.role)}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-xs font-semibold transition-colors shadow-sm"
          >
            <span>Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800/70 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-[#0c0c0e] px-4 py-4 space-y-4 shadow-2xl">
          <div className="flex flex-col space-y-1">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-3 pb-1">
              Navigation
            </span>
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={(e) => {
                    handleNavClick(e, item);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white bg-zinc-800 font-semibold'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-zinc-800/80 space-y-3">
            <div>
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block px-1 mb-2">
                Active Role
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {(['OWNER', 'REPAIRER', 'RECYCLER', 'ADMIN'] as const).map((r) => {
                  const label = r.charAt(0) + r.slice(1).toLowerCase();
                  return (
                    <button
                      key={r}
                      onClick={() => {
                        handleRoleSelect(r);
                        setMobileMenuOpen(false);
                      }}
                      className={`py-2 px-3 rounded-lg text-xs font-medium text-center border transition-colors ${
                        currentUser.role === r
                          ? 'bg-zinc-800 text-amber-400 border-zinc-700 font-semibold'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/scan"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-10 flex items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 text-center text-xs font-medium text-zinc-200 hover:bg-zinc-800 transition-colors"
              >
                <QrCode className="w-3.5 h-3.5 text-zinc-400" />
                <span>Scan Product QR</span>
              </Link>
              <Link
                to={getDashboardPath(currentUser.role)}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-10 flex items-center justify-center gap-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-center text-xs font-semibold transition-colors"
              >
                <span>Open {formattedRole} Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
