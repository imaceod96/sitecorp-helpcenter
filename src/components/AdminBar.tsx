import React, { useRef } from 'react';
import { useHelpCenter } from '../context/HelpCenterContext';
import {
  FolderPlus,
  FilePlus,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  Users,
  LogOut,
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
    openUserManagerModal,
    currentAdminUser,
    logoutAdmin,
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
    <div className="bg-[#0D2E3F] text-white border-b border-[#123F55] px-4 py-2.5 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: Mode Title & Current User */}
        <div className="flex items-center gap-2.5 font-semibold text-amber-400">
          <ShieldCheck className="w-4 h-4 text-[#F49D37]" />
          <span>Modo Administrador Activo</span>
          <span className="hidden md:inline text-slate-400 font-normal">|</span>
          <span className="hidden md:inline font-mono text-[11px] text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
            {currentAdminUser ? `${currentAdminUser.name} (${currentAdminUser.email})` : 'admin@sitecorp.local'}
          </span>
        </div>

        {/* Center/Right: Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          <button
            onClick={() => openCategoryModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A7B91] hover:bg-[#166477] text-white font-medium rounded-lg transition-colors shadow-xs"
          >
            <FolderPlus className="w-3.5 h-3.5 text-white" />
            <span>+ Nuevo Apartado</span>
          </button>

          <button
            onClick={() => openArticleModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F49D37] hover:bg-[#E08A24] text-[#123F55] font-bold rounded-lg transition-colors shadow-xs"
          >
            <FilePlus className="w-3.5 h-3.5 text-[#123F55]" />
            <span>+ Nueva Página</span>
          </button>

          <button
            onClick={openUserManagerModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#123F55] hover:bg-[#0F3447] text-white border border-[#2D5A73] font-medium rounded-lg transition-colors shadow-xs"
            title="Gestionar usuarios administradores y cambiar contraseñas"
          >
            <Users className="w-3.5 h-3.5 text-[#F49D37]" />
            <span>Usuarios & Claves</span>
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-md transition-colors"
            title="Descargar copia de seguridad en JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Exportar JSON</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-md transition-colors"
            title="Cargar copia de seguridad desde un archivo JSON"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Importar JSON</span>
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
            <span className="hidden xl:inline">Restablecer</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1 px-2.5 py-1.5 text-slate-300 hover:text-rose-300 rounded-md hover:bg-slate-800 transition-colors ml-1"
            title="Cerrar sesión de administrador"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>

          <button
            onClick={() => setIsAdminMode(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
            title="Ocultar barra de administración"
          >
            <X className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
};
