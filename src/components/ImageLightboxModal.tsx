import React, { useEffect } from 'react';
import { useHelpCenter } from '../context/HelpCenterContext';
import { X, ZoomOut } from 'lucide-react';

export const ImageLightboxModal: React.FC = () => {
  const { lightboxImage, closeLightbox } = useHelpCenter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };
    if (lightboxImage) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage, closeLightbox]);

  if (!lightboxImage) return null;

  return (
    <div
      onClick={closeLightbox}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md cursor-zoom-out"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-6xl max-h-[92vh] flex flex-col items-center cursor-default"
      >
        <button
          onClick={closeLightbox}
          className="absolute -top-11 right-0 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          <ZoomOut className="w-4 h-4" />
          <span>Cerrar</span>
          <X className="w-5 h-5 ml-1" />
        </button>

        <img
          src={lightboxImage.url}
          alt={lightboxImage.caption || 'Captura de pantalla'}
          className="max-h-[82vh] w-auto max-w-full rounded-xl shadow-2xl object-contain border border-slate-700/60 bg-slate-900"
          referrerPolicy="no-referrer"
        />

        {lightboxImage.caption && (
          <p className="text-sm text-slate-200 bg-slate-900/90 border border-slate-700/80 px-4 py-2 rounded-lg mt-3 text-center max-w-2xl">
            {lightboxImage.caption}
          </p>
        )}
      </div>
    </div>
  );
};
