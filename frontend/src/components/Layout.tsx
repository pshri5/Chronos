import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavLink = ({ to, label }: { to: string; label: string }) => {
    const isActive = location.pathname.startsWith(to);
    return (
      <Link
        to={to}
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
          isActive 
            ? 'text-white bg-primary-600/20 border border-primary-500/30' 
            : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen relative">
      {/* Dynamic Mesh Background */}
      <div className="mesh-bg" />

      {/* Header */}
      <header className="glass-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-tight leading-none">CHRONOS</span>
                <span className="text-[10px] font-bold text-primary-400 tracking-[0.2em] uppercase mt-0.5">Scheduler</span>
              </div>
            </Link>

            {/* Nav */}
            {token && (
              <nav className="hidden md:flex items-center gap-2">
                <NavLink to="/jobs" label="Dashboard" />
                <NavLink to="/notifications" label="Alerts" />
                <NavLink to="/job-logs" label="Logs" />
              </nav>
            )}

            {/* Auth actions */}
            <div className="flex items-center gap-4">
              {token ? (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 rounded-xl transition-all duration-300"
                >
                  Sign Out
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 opacity-50">
               <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-bold tracking-widest uppercase">Chronos</span>
            </div>
            <p className="text-slate-500 text-xs">
              &copy; {new Date().getFullYear()} Chronos Platform. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-500 hover:text-white transition-colors text-xs">Documentation</a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors text-xs">API Status</a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors text-xs">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;