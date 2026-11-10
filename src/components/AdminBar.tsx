import React, { useRef } from 'react';
import { useHelpCenter } from '../context/HelpCenterContext';
import {
  FolderPlus,
  FilePlus,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  X,
} from 'lucide-react';

export const AdminBar: React.FC = () => {
  const {
    isAdminMode,
    setIsAdminMode,
    openCategoryModal,
    openArticleModal,
    exportDataJSON,
    importDataJSON,
    resetToDefaults,
  } = useHelpCenter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAdminMode) return null;

  const handleExport = () => {
    const json = exportDataJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sitecorp_help_center_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataJSON(content);
        if (success) {
          alert('¡Datos del Centro de Ayuda importados con éxito!');
        } else {
          alert('Error: El archivo JSON no tiene un formato válido.');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 px-4 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: Mode Title */}
        <div className="flex items-center gap-2 font-semibold text-amber-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Modo Administrador Activo — Gestión en vivo del Centro de Ayuda</span>
        </div>

        {/* Center/Right: Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          <button
            onClick={() => openCategoryModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md transition-colors"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>+ Nuevo Apartado / Sección</span>
          </button>

          <button
            onClick={() => openArticleModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-md transition-colors"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>+ Nueva Página / Funcionalidad</span>
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-md transition-colors"
            title="Descargar copia de seguridad en JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Exportar JSON</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-md transition-colors"
            title="Cargar copia de seguridad desde un archivo JSON"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Importar JSON</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={resetToDefaults}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 rounded-md transition-colors"
            title="Restablecer todos los datos iniciales de SiteCorp"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Restablecer</span>
          </button>

          <button
            onClick={() => setIsAdminMode(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors ml-2"
            title="Salir del modo administrador"
          >
            <X className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
};
