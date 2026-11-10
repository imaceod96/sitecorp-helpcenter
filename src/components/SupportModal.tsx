import React, { useState, useEffect } from 'react';
import { useHelpCenter } from '../context/HelpCenterContext';
import { X, Send, CheckCircle, Mail, MessageSquare, Loader2, AlertCircle } from 'lucide-react';

// Endpoint y Entry IDs oficiales del formulario de Google Forms (https://forms.gle/Net8KryG96gQeisM8)
const GOOGLE_FORM_ACTION_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeBB3o1NqYggWTlihYun27AoKv4CWYbt4BAF_aMG5DB8Uf6BA/formResponse';

const GOOGLE_FORM_ENTRIES = {
  nombre: 'entry.1630175528',
  correo: 'entry.353244420',
  modulo: 'entry.1277824037',
  mensaje: 'entry.1899944236',
} as const;

export const SupportModal: React.FC = () => {
  const { isSupportModalOpen, setIsSupportModalOpen, categories, viewState } = useHelpCenter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [moduleName, setModuleName] = useState('Consulta General');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Sincroniza el módulo seleccionado si el usuario está viendo un apartado específico
  // o si el apartado que tenía seleccionado fue eliminado
  useEffect(() => {
    if (!isSupportModalOpen) return;

    if (viewState.type === 'category' || viewState.type === 'article') {
      const activeCat = categories.find((c) => c.id === viewState.categoryId);
      if (activeCat) {
        setModuleName(activeCat.title);
        return;
      }
    }

    // Verifica que la opción actual siga existiendo en las secciones activas
    const existsInCategories = categories.some((c) => c.title === moduleName);
    if (moduleName !== 'Consulta General' && !existsInCategories) {
      setModuleName('Consulta General');
    }
  }, [isSupportModalOpen, categories, viewState]);

  if (!isSupportModalOpen) return null;

  const handleClose = () => {
    if (isSubmitting) return;
    setIsSupportModalOpen(false);
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formParams = new URLSearchParams();
      formParams.append(GOOGLE_FORM_ENTRIES.nombre, name.trim());
      formParams.append(GOOGLE_FORM_ENTRIES.correo, email.trim());
      formParams.append(GOOGLE_FORM_ENTRIES.modulo, moduleName);
      formParams.append(GOOGLE_FORM_ENTRIES.mensaje, message.trim());

      await fetch(GOOGLE_FORM_ACTION_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formParams.toString(),
      });

      setIsSubmitting(false);
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setName('');
        setEmail('');
        setModuleName('Consulta General');
        setMessage('');
        setIsSupportModalOpen(false);
      }, 2800);
    } catch {
      setIsSubmitting(false);
      setSubmitError('No se pudo conectar con el servidor de soporte. Revisa tu conexión e inténtalo de nuevo.');
    }
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
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-[#1A7B91] mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-[#123F55]">¡Consulta Enviada con Éxito!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Tu solicitud ha sido registrada en el buzón de soporte de SiteCorp. Un especialista te responderá a tu correo a la brevedad.
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
                disabled={isSubmitting}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Manuel Fernández"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91] disabled:opacity-60"
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
                  disabled={isSubmitting}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu.correo@empresa.cu"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91] disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Módulo relacionado
              </label>
              <select
                value={moduleName}
                disabled={isSubmitting}
                onChange={(e) => setModuleName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91] disabled:opacity-60"
              >
                <option value="Consulta General">Consulta General</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.title}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ¿En qué podemos ayudarte?
              </label>
              <textarea
                rows={4}
                required
                disabled={isSubmitting}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe tu duda o problema con el mayor detalle posible..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91] disabled:opacity-60"
              />
            </div>

            {submitError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#123F55] hover:bg-[#0F3447] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 text-[#F49D37] animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-[#F49D37]" />
                    <span>Enviar Consulta</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
