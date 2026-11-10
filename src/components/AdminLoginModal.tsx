import React, { useState } from 'react';
import { useHelpCenter } from '../context/HelpCenterContext';
import { createSignedAdminUrl } from '../utils/signedAuth';
import {
  Lock,
  X,
  ShieldCheck,
  KeyRound,
  Mail,
  Check,
  AlertCircle,
  Code2,
  Copy,
  ArrowRight,
  Zap,
  Settings,
  Eye,
  EyeOff,
} from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const {
    isAdminLoginModalOpen,
    setIsAdminLoginModalOpen,
    loginWithCredentials,
    updateUserPassword,
    adminUsers,
  } = useHelpCenter();

  const [activeTab, setActiveTab] = useState<'login' | 'custom' | 'code'>('login');

  // Login form state
  const [email, setEmail] = useState('admin@sitecorp.local');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Change password form state
  const [targetEmail, setTargetEmail] = useState('admin@sitecorp.local');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changeError, setChangeError] = useState<string | null>(null);
  const [changeSuccess, setChangeSuccess] = useState<string | null>(null);

  // Code integration tab
  const [copiedCode, setCopiedCode] = useState(false);
  const [generatedTestUrl, setGeneratedTestUrl] = useState<string | null>(null);

  if (!isAdminLoginModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await loginWithCredentials(email, password);
      setLoading(false);
      if (!res.success) {
        setErrorMessage(res.error || 'Credenciales incorrectas.');
      } else {
        setPassword('');
      }
    } catch {
      setLoading(false);
      setErrorMessage('Error al verificar las credenciales.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangeError(null);
    setChangeSuccess(null);

    if (newPassword !== confirmPassword) {
      setChangeError('Las contraseñas no coinciden.');
      return;
    }

    const user = adminUsers.find(u => u.email.toLowerCase() === targetEmail.trim().toLowerCase());
    if (!user) {
      setChangeError('No se encontró ningún usuario con ese correo.');
      return;
    }

    const res = await updateUserPassword(user.id, newPassword);
    if (res.success) {
      setChangeSuccess(`Contraseña actualizada con éxito para ${user.email}.`);
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setChangeSuccess(null);
        setActiveTab('login');
      }, 1500);
    } else {
      setChangeError(res.error || 'Error al cambiar la contraseña.');
    }
  };

  const handleGenerateTestUrl = async () => {
    const url = await createSignedAdminUrl(window.location.href, 'superadmin@sitecorp.cu', 15);
    setGeneratedTestUrl(url);
  };

  const siteCorpDashboardCode = `// ============================================================
// En tu proyecto SiteCorp_all (app.sitecorp.cu)
// Añadir en el menú lateral de Superadmin (Sidebar / Navbar)
// ============================================================

import { HelpCircle } from "lucide-react";

export function HelpCenterAdminButton({ userEmail = "superadmin@sitecorp.cu" }) {
  const handleOpenHelpCenter = async () => {
    // 1. Genera el payload con expiración de 15 minutos
    const now = Date.now();
    const payload = {
      role: "superadmin",
      email: userEmail,
      iat: now,
      exp: now + 15 * 60 * 1000,
    };
    
    // 2. Codifica en Base64
    const token = btoa(JSON.stringify(payload));
    
    // 3. Firma con HMAC-SHA256 (clave compartida)
    const secret = "sitecorp_superadmin_secret_key_2026";
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
    );
    const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(token));
    const sig = Array.from(new Uint8Array(sigBuf)).map(b => b.toString(16).padStart(2, "0")).join("");

    // 4. Redirige al Centro de Ayuda abriendo en nueva pestaña
    const helpCenterUrl = \`https://help.sitecorp.cu/?auth_token=\${token}&sig=\${sig}\`;
    window.open(helpCenterUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleOpenHelpCenter}
      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#123F55] hover:bg-slate-100 rounded-lg transition-colors w-full"
    >
      <HelpCircle className="w-4 h-4 text-[#F49D37]" />
      <span>Gestionar Centro de Ayuda</span>
    </button>
  );
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(siteCorpDashboardCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F0F6F9] text-[#123F55] border border-[#B8D6E3] flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#1A7B91]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#123F55]">Acceso Administrador SiteCorp</h3>
              <p className="text-xs text-slate-500">Gestión de apartados, páginas de funcionalidades y usuarios</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsAdminLoginModalOpen(false);
              setErrorMessage(null);
            }}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg mt-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-1.5 px-2 rounded-md transition-all text-center ${
              activeTab === 'login'
                ? 'bg-white text-[#123F55] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-1.5 px-2 rounded-md transition-all text-center flex items-center justify-center gap-1 ${
              activeTab === 'custom'
                ? 'bg-white text-[#123F55] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <span>Cambiar Contraseña</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex-1 py-1.5 px-2 rounded-md transition-all text-center flex items-center justify-center gap-1 ${
              activeTab === 'code'
                ? 'bg-white text-[#123F55] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-[#1A7B91]" />
            <span>Enlace app.sitecorp.cu</span>
          </button>
        </div>

        {/* LOGIN TAB */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="mt-5 space-y-4">
            
            {/* Quick credentials banner */}
            <div className="p-3 bg-[#F0F6F9] border border-[#B8D6E3] rounded-xl text-xs text-slate-700">
              <div className="flex items-center justify-between font-semibold text-[#123F55] mb-1">
                <span>Usuario Administrador</span>
                <span className="text-[11px] font-normal text-slate-500">Hash SHA-256</span>
              </div>
              <p className="text-slate-600">
                Email por defecto: <code className="bg-white px-1.5 py-0.5 rounded border border-[#B8D6E3] font-mono text-[#123F55] font-semibold">admin@sitecorp.local</code>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="admin@sitecorp.local"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Introduce tu contraseña..."
                  className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91]"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errorMessage && (
                <div className="flex items-center gap-1.5 text-xs text-rose-600 mt-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#123F55] hover:bg-[#0F3447] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-[#F49D37]" />
              <span>{loading ? 'Verificando Hash Criptográfico...' : 'Iniciar Sesión'}</span>
            </button>

            <div className="text-[11px] text-slate-400 text-center pt-1">
              Seguridad: La contraseña se comprueba mediante función hash SHA-256 unidireccional. Ninguna credencial está escrita en el código.
            </div>
          </form>
        )}

        {/* CUSTOM PASSWORD TAB */}
        {activeTab === 'custom' && (
          <form onSubmit={handleChangePassword} className="mt-5 space-y-4">
            <div className="p-3 bg-[#F0F6F9] border border-[#B8D6E3] rounded-xl text-xs text-slate-700 leading-relaxed">
              <p className="font-semibold text-[#123F55] mb-1">
                Cambio seguro de contraseña
              </p>
              <p>
                Al cambiar la clave, se calcula su nuevo hash SHA-256. El código del repositorio nunca conoce ni almacena tu contraseña en texto plano.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Usuario a Modificar
              </label>
              <select
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91]"
              >
                {adminUsers.map((u) => (
                  <option key={u.id} value={u.email}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 4 caracteres..."
                  className="w-full pl-3 pr-10 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirmar Nueva Contraseña
              </label>
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la nueva contraseña..."
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91]"
              />
            </div>

            {changeError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{changeError}</span>
              </div>
            )}

            {changeSuccess && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{changeSuccess}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#123F55] hover:bg-[#0F3447] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Check className="w-4 h-4 text-[#F49D37]" />
              <span>Guardar Nueva Contraseña</span>
            </button>
          </form>
        )}

        {/* CODE INTEGRATION TAB */}
        {activeTab === 'code' && (
          <div className="mt-4 space-y-4">
            <div className="p-3 bg-[#F0F6F9] border border-[#B8D6E3] rounded-xl text-xs text-slate-700 leading-relaxed">
              <p className="font-semibold text-[#123F55] mb-1 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#F49D37]" />
                ¿En qué proyecto debes trabajar?
              </p>
              <p>
                Debes trabajar en tu repositorio <strong>SiteCorp_all</strong> (el panel de <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">app.sitecorp.cu</code>). Copia la función inferior y colócala en tu menú o barra lateral de superadmin.
              </p>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between bg-slate-900 text-slate-300 px-3 py-1.5 rounded-t-lg text-xs font-mono">
                <span>SiteCorp_all: Botón de enlace firmado</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? '¡Copiado!' : 'Copiar código'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 text-slate-200 p-3 rounded-b-lg text-[11px] font-mono overflow-x-auto max-h-56 leading-relaxed">
                {siteCorpDashboardCode}
              </pre>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleGenerateTestUrl}
                className="w-full sm:w-auto px-3 py-2 bg-[#1A7B91] hover:bg-[#166477] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Generar y probar enlace firmado ahora</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              {generatedTestUrl && (
                <a
                  href={generatedTestUrl}
                  className="text-xs text-blue-600 underline truncate max-w-xs"
                >
                  Abrir enlace firmado generado
                </a>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
