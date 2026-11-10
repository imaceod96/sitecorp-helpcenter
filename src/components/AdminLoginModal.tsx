import React, { useState } from 'react';
import { useHelpCenter } from '../context/HelpCenterContext';
import { createSignedAdminUrl } from '../utils/signedAuth';
import {
  Lock,
  X,
  ShieldCheck,
  KeyRound,
  ExternalLink,
  ArrowRight,
  Code2,
  Copy,
  Check,
  Zap,
} from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const {
    isAdminLoginModalOpen,
    setIsAdminLoginModalOpen,
    loginAsAdmin,
  } = useHelpCenter();

  const [activeTab, setActiveTab] = useState<'login' | 'code'>('login');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [generatedTestUrl, setGeneratedTestUrl] = useState<string | null>(null);

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
    loginAsAdmin('superadmin');
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
              <h3 className="text-base font-bold text-[#123F55]">Acceso Superadministrador</h3>
              <p className="text-xs text-slate-500">Gestión de apartados y páginas de funcionalidad</p>
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

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg mt-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-1.5 px-3 rounded-md transition-all text-center ${
              activeTab === 'login'
                ? 'bg-white text-[#123F55] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Acceso Rápido
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex-1 py-1.5 px-3 rounded-md transition-all text-center flex items-center justify-center gap-1.5 ${
              activeTab === 'code'
                ? 'bg-white text-[#123F55] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-[#1A7B91]" />
            <span>Integración app.sitecorp.cu</span>
          </button>
        </div>

        {activeTab === 'login' ? (
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
                  placeholder="admin / superadmin"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91]"
                  autoFocus
                />
              </div>
              {error && (
                <p className="text-xs text-rose-600 mt-1.5">
                  Clave incorrecta. Puedes usar &apos;admin&apos; o validar directamente con el botón inferior.
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

            {/* Direct Validation button */}
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
                  Simula la entrada autenticada de Superadministrador en un clic.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#F49D37] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>

            <div className="text-[11px] text-slate-400 text-center pt-2">
              Atajo rápido: Puedes abrir o cerrar este panel pulsando <kbd className="font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-200 text-slate-600">Ctrl + Shift + A</kbd> en cualquier momento.
            </div>
          </form>
        ) : (
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

            {/* Test button to generate a real signed link right now */}
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
