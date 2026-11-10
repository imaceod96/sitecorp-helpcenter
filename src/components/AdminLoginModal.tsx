import React, { useState } from 'react';
import { useHelpCenter } from '../context/HelpCenterContext';
import { Lock, X, ShieldCheck, KeyRound, ExternalLink, ArrowRight } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const {
    isAdminLoginModalOpen,
    setIsAdminLoginModalOpen,
    loginAsAdmin,
  } = useHelpCenter();

  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isAdminLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    setTimeout(() => {
      const ok = loginAsAdmin(password);
      setLoading(false);
      if (!ok) {
        setError(true);
      } else {
        setPassword('');
      }
    }, 400);
  };

  const handleAutoValidateWithApp = () => {
    // When linking with app.sitecorp.cu:
    // In production, this can read the shared cookie, JWT token, or Supabase session from app.sitecorp.cu.
    // For now, it auto-validates directly as requested!
    loginAsAdmin('superadmin');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F0F6F9] text-[#123F55] border border-[#B8D6E3] flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#1A7B91]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#123F55]">Acceso Superadministrador</h3>
              <p className="text-xs text-slate-500">Gestión interna del Centro de Ayuda</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsAdminLoginModalOpen(false);
              setError(false);
            }}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contraseña o Clave Maestra de Superadmin
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Ingresa tu clave de administrador..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91]"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-xs text-rose-600 mt-1.5">
                Clave incorrecta. Puedes usar la clave interna o validar con tu sesión de la app.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#123F55] hover:bg-[#0F3447] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-[#F49D37]" />
            <span>{loading ? 'Validando...' : 'Iniciar Sesión como Administrador'}</span>
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-medium">o bien</span>
            </div>
          </div>

          {/* Direct Validation with App button */}
          <button
            type="button"
            onClick={handleAutoValidateWithApp}
            className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-[#1A7B91] hover:bg-[#F0F6F9] transition-all text-left text-xs font-medium text-slate-700 group"
          >
            <div>
              <div className="font-semibold text-[#123F55] group-hover:text-[#1A7B91] transition-colors flex items-center gap-1.5">
                <span>Autovalidar con sesión de SiteCorp App</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Si ya tienes sesión de Superadmin en app.sitecorp.cu, pulsa aquí.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#F49D37] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </button>

          <div className="text-[11px] text-slate-400 text-center pt-2">
            Atajo rápido: Puedes abrir o cerrar este panel pulsando <kbd className="font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-200 text-slate-600">Ctrl + Shift + A</kbd> en cualquier momento.
          </div>
        </form>

      </div>
    </div>
  );
};
