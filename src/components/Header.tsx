import React from 'react';
import { useHelpCenter } from '../context/HelpCenterContext';
import { Logo } from './Logo';
import { ExternalLink, LifeBuoy, ShieldCheck, LogOut } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    goToHome,
    isAdminMode,
    logoutAdmin,
    setIsSupportModalOpen,
  } = useHelpCenter();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single Brand Element with official Logo */}
        <button
          onClick={goToHome}
          className="flex items-center gap-3 text-left group whitespace-nowrap shrink-0 focus:outline-none"
        >
          <Logo tone="dark" className="h-8 sm:h-9" />
          <div className="h-5 w-px bg-slate-200 hidden sm:block" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1A7B91] hidden sm:inline">
            Centro de Ayuda
          </span>
        </button>

        {/* Zone 2: 4 concise single-line nav links linking directly to real sites */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={goToHome}
            className="hover:text-[#123F55] transition-colors whitespace-nowrap shrink-0 focus:outline-none"
          >
            Inicio
          </button>
          
          <a
            href="https://app.sitecorp.cu/login"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#123F55] transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1"
          >
            <span>Ir a la App</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <a
            href="https://www.sitecorp.cu/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#123F55] transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1"
          >
            <span>Sitio Web</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <button
            onClick={() => setIsSupportModalOpen(true)}
            className="hover:text-[#123F55] transition-colors whitespace-nowrap shrink-0 focus:outline-none inline-flex items-center gap-1.5"
          >
            <LifeBuoy className="w-4 h-4 text-[#1A7B91]" />
            <span>Contactar Soporte</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {isAdminMode ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#FEF8F0] text-[#D88224] border border-[#FBDEB9]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F49D37]" />
                <span className="hidden sm:inline">Sesión Superadmin</span>
              </span>
              <button
                onClick={logoutAdmin}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Cerrar sesión de administrador"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <a
              href="https://app.sitecorp.cu/login"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#123F55] hover:bg-[#0F3447] rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
            >
              <span>Acceder a SiteCorp</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#F49D37]" />
            </a>
          )}
        </div>

      </div>
    </header>
  );
};
