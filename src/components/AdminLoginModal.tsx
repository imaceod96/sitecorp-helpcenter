import React, { useState } from 'react';
import { useHelpCenter } from '../context/HelpCenterContext';
import {
  Lock,
  X,
  ShieldCheck,
  KeyRound,
  Mail,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const {
    isAdminLoginModalOpen,
    setIsAdminLoginModalOpen,
    loginWithCredentials,
  } = useHelpCenter();

  // Login form state - starts completely empty with no prefilled or suggested data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAdminLoginModalOpen) return null;

  const handleClose = () => {
    setIsAdminLoginModalOpen(false);
    setErrorMessage(null);
    setEmail('');
    setPassword('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await loginWithCredentials(email.trim(), password);
      setLoading(false);
      if (!res.success) {
        setErrorMessage(res.error || 'Credenciales incorrectas. Verifica el usuario y la contraseña.');
      } else {
        setEmail('');
        setPassword('');
      }
    } catch {
      setLoading(false);
      setErrorMessage('Error al verificar las credenciales.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0F6F9] text-[#123F55] border border-[#B8D6E3] flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#1A7B91]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#123F55]">Acceso Administrador</h3>
              <p className="text-xs text-slate-500">Introduce tus credenciales para acceder</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clean Login Form */}
        <form onSubmit={handleLogin} className="mt-5 space-y-4" autoComplete="off">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                autoComplete="off"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Introduce tu correo electrónico..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91] transition-colors"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Introduce tu contraseña..."
                className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#123F55] hover:bg-[#0F3447] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 text-[#F49D37]" />
            <span>{loading ? 'Verificando...' : 'Iniciar Sesión'}</span>
          </button>
        </form>

      </div>
    </div>
  );
};
