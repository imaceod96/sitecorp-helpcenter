import React from 'react';
import { Logo } from './Logo';
import { useHelpCenter } from '../context/HelpCenterContext';
import { LifeBuoy, BookOpen, ExternalLink, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const {
    categories,
    goToCategory,
    goToHome,
    setIsSupportModalOpen,
    setIsAdminLoginModalOpen,
    isAdminMode,
    logoutAdmin,
  } = useHelpCenter();

  return (
    <footer className="bg-[#123F55] text-slate-300 border-t border-[#0F3447]">
      {/* Pre-footer Support CTA (Inspired by Viterbit Help Center bottom support section) */}
      <div className="bg-[#0F3447] py-12 px-4 sm:px-6 lg:px-8 border-b border-[#0C2A3A]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              ¿No encuentras la respuesta que buscas?
            </h3>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Nuestro equipo técnico y especialistas funcionales de SiteCorp están disponibles para asistirte con cualquier módulo.
            </p>
          </div>
          <button
            onClick={() => setIsSupportModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#F49D37] hover:bg-[#D88224] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-colors shrink-0"
          >
            <LifeBuoy className="w-4 h-4" />
            <span>Contactar con Asistencia</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <Logo tone="light" className="h-8" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Plataforma corporativa integral de gestión empresarial, organización multi-entidad, control laboral y dirección de obras.
            </p>
            <div className="text-xs text-slate-400">
              Centro de Ayuda Oficial · SiteCorp
            </div>
          </div>

          {/* Quick Collections */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#F49D37]" />
              <span>Colecciones Principales</span>
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => goToCategory(cat.id)}
                    className="hover:text-white transition-colors text-slate-400 text-left"
                  >
                    {cat.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* More Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Módulos y Especialidades
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => goToCategory(cat.id)}
                    className="hover:text-white transition-colors text-slate-400 text-left"
                  >
                    {cat.title}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={goToHome}
                  className="hover:text-white transition-colors text-slate-400 text-left font-medium"
                >
                  Ver todos los apartados →
                </button>
              </li>
            </ul>
          </div>

          {/* Real Links to SiteCorp Web & App */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Plataforma SiteCorp
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://app.sitecorp.cu/login"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors text-slate-400 inline-flex items-center gap-1.5"
                >
                  <span>Iniciar Sesión en la App</span>
                  <ExternalLink className="w-3 h-3 text-[#F49D37]" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.sitecorp.cu/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors text-slate-400 inline-flex items-center gap-1.5"
                >
                  <span>Web Oficial www.sitecorp.cu</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <button
                  onClick={() => setIsSupportModalOpen(true)}
                  className="hover:text-white transition-colors text-slate-400 inline-flex items-center gap-1"
                >
                  <span>Buzón de Incidencias Técnicas</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Quiet copyright with discreet Superadmin link */}
        <div className="mt-12 pt-8 border-t border-[#0F3447] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} SiteCorp. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer transition-colors">Aviso Legal</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-white cursor-pointer transition-colors">Privacidad</span>
            <span aria-hidden="true">·</span>
            
            {/* Discreet Admin Mode Button at the end */}
            {!isAdminMode ? (
              <button
                onClick={() => setIsAdminLoginModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:text-slate-200 border border-slate-700/60 rounded-md hover:border-slate-500 bg-slate-800/30 transition-colors focus:outline-none"
                title="Acceso al Modo Administrador"
              >
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Modo Admin</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-[#F49D37] border border-[#D88224]/50 rounded-md bg-[#F49D37]/10">
                  <span>Modo Admin: Activo</span>
                </span>
                <button
                  onClick={logoutAdmin}
                  className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors underline"
                  title="Salir del modo administrador"
                >
                  Salir
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
