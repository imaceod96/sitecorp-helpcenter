import React, { useState, useEffect } from 'react';
import { useHelpCenter } from '../context/HelpCenterContext';
import { Category } from '../types/helpCenter';
import { ICON_OPTIONS, renderCategoryIcon } from '../utils/iconMap';
import { X, Check } from 'lucide-react';

export const CreateCategoryModal: React.FC = () => {
  const {
    isCategoryModalOpen,
    categoryToEdit,
    closeCategoryModal,
    addCategory,
    updateCategory,
  } = useHelpCenter();

  const [title, setTitle] = useState('');
  const [id, setId] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [icon, setIcon] = useState('Compass');
  const [accentColor, setAccentColor] = useState<Category['accentColor']>('blue');
  const [badge, setBadge] = useState('');

  useEffect(() => {
    if (categoryToEdit) {
      setTitle(categoryToEdit.title);
      setId(categoryToEdit.id);
      setShortDescription(categoryToEdit.shortDescription);
      setIcon(categoryToEdit.icon);
      setAccentColor(categoryToEdit.accentColor);
      setBadge(categoryToEdit.badge || '');
    } else {
      setTitle('');
      setId('');
      setShortDescription('');
      setIcon('Compass');
      setAccentColor('blue');
      setBadge('');
    }
  }, [categoryToEdit, isCategoryModalOpen]);

  if (!isCategoryModalOpen) return null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!categoryToEdit) {
      const generatedSlug = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setId(generatedSlug);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !id.trim()) {
      alert('Por favor indica un título y un identificador para el apartado.');
      return;
    }

    if (categoryToEdit) {
      updateCategory({
        ...categoryToEdit,
        title,
        shortDescription,
        icon,
        accentColor,
        badge: badge.trim() || undefined,
      });
    } else {
      addCategory({
        id,
        title,
        shortDescription,
        icon,
        accentColor,
        badge: badge.trim() || undefined,
      });
    }

    closeCategoryModal();
  };

  const colors: Category['accentColor'][] = ['blue', 'emerald', 'indigo', 'amber', 'purple', 'cyan', 'slate'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F0F6F9] text-[#123F55] border border-[#B8D6E3] flex items-center justify-center">
              {renderCategoryIcon(icon, 'w-5 h-5')}
            </div>
            <h3 className="text-lg font-bold text-[#123F55]">
              {categoryToEdit ? 'Editar Apartado / Sección' : 'Crear Nuevo Apartado'}
            </h3>
          </div>
          <button
            onClick={closeCategoryModal}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Título del Apartado / Módulo <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="Ej. Control de Subcontratistas y Cuadrillas"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91] focus:ring-1 focus:ring-[#1A7B91]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Identificador (Slug para URL) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              disabled={!!categoryToEdit}
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="ej. control-subcontratistas"
              className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91] disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Descripción corta
            </label>
            <textarea
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Breve resumen de los contenidos que se agruparán en este apartado..."
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91] focus:ring-1 focus:ring-[#1A7B91]/20"
            />
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Seleccionar Icono del Módulo
            </label>
            <div className="grid grid-cols-5 gap-2 max-h-36 overflow-y-auto p-1 border border-slate-200 rounded-lg bg-slate-50">
              {ICON_OPTIONS.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = icon === opt.name;
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setIcon(opt.name)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs transition-all ${
                      isSelected
                        ? 'bg-[#123F55] text-white shadow-xs font-semibold'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                    title={opt.label}
                  >
                    <IconComponent className="w-5 h-5 mb-1" />
                    <span className="text-[10px] truncate max-w-full">{opt.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accent Color & Badge */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Color de acento
              </label>
              <div className="flex items-center gap-2 mt-1">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setAccentColor(c)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      c === 'blue'
                        ? 'bg-[#123F55]'
                        : c === 'emerald'
                        ? 'bg-emerald-500'
                        : c === 'indigo'
                        ? 'bg-indigo-500'
                        : c === 'amber'
                        ? 'bg-[#F49D37]'
                        : c === 'purple'
                        ? 'bg-purple-500'
                        : c === 'cyan'
                        ? 'bg-[#1A7B91]'
                        : 'bg-slate-500'
                    } ${accentColor === c ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : 'opacity-80 hover:opacity-100'}`}
                  >
                    {accentColor === c && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Etiqueta / Badge (opcional)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Ej. Nuevo, Central, Pro"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91]"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeCategoryModal}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#123F55] hover:bg-[#0F3447] rounded-lg shadow-xs transition-colors"
            >
              {categoryToEdit ? 'Guardar Cambios' : 'Crear Apartado'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
