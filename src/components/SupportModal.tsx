import React, { useState } from 'react';
import { useHelpCenter } from '../context/HelpCenterContext';
import { X, Send, CheckCircle, Mail, MessageSquare } from 'lucide-react';

export const SupportModal: React.FC = () => {
  const { isSupportModalOpen, setIsSupportModalOpen } = useHelpCenter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [moduleName, setModuleName] = useState('General');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isSupportModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setMessage('');
      setIsSupportModalOpen(false);
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F0F6F9] text-[#123F55] border border-[#B8D6E3] flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-[#1A7B91]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#123F55]">Contactar Soporte SiteCorp</h3>
              <p className="text-xs text-slate-500">¿No encuentras lo que buscas en las guías?</p>
            </div>
          </div>
          <button
            onClick={() => setIsSupportModalOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-[#1A7B91] mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-[#123F55]">¡Consulta Enviada con Éxito!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Un especialista de soporte de SiteCorp revisará tu duda técnica y te responderá a tu correo en menos de 24 horas.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre y Apellidos
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Manuel Fernández"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Correo Electrónico Corporativo
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu.correo@empresa.cu"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Módulo relacionado
              </label>
              <select
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91]"
              >
                <option value="General">Consulta General</option>
                <option value="Organización">Organización y Multi-Entidad</option>
                <option value="Plantilla">Plantilla y Anexo 14B</option>
                <option value="Personas">Personas y Expedientes</option>
                <option value="Vacaciones">Vacaciones y Devengos (+1.92)</option>
                <option value="SC04">Licencias Médicas y Modelo SC-4-04</option>
                <option value="EscalaSalarial">Escalas Salariales (Grupos I al XXIV)</option>
                <option value="PlantillasWord">Plantillas Documentales Word</option>
                <option value="Roles">Seguridad y Roles (RBAC)</option>
                <option value="Obras">Obras y Control de Proyectos</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ¿En qué podemos ayudarte?
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe tu duda o problema con el mayor detalle posible..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91]"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsSupportModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#123F55] hover:bg-[#0F3447] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-[#F49D37]" />
                <span>Enviar Consulta</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
