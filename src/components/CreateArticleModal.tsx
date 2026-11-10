import React, { useState, useEffect } from 'react';
import { useHelpCenter } from '../context/HelpCenterContext';
import { Article, ArticleSection, CalloutType } from '../types/helpCenter';
import { ADMIN_AUTHOR } from '../data/initialData';
import {
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload,
  AlertCircle,
  ListOrdered,
} from 'lucide-react';

const PRESET_SCREENSHOTS = [
  {
    name: 'Jerarquía Multi-Entidad (Grupos, Empresas, UEB)',
    url: '/assets/aistudio/Captura_de_pantalla_2026-11-02_a_las_12.49.09_p._m._3b8dd9ea.png',
  },
  {
    name: 'Plantilla y Anexo 14B Oficial',
    url: '/assets/aistudio/Captura_de_pantalla_2026-11-02_a_las_12.50.12_p._m._b98532c5.png',
  },
  {
    name: 'Vacaciones y Devengos (+1.92 d)',
    url: '/assets/aistudio/Captura_de_pantalla_2026-11-02_a_las_12.51.41_p._m._af65ffdb.png',
  },
  {
    name: 'Plantillas Word (.docx) Dinámicas',
    url: '/assets/aistudio/Captura_de_pantalla_2026-11-02_a_las_12.51.55_p._m._7939ec7d.png',
  },
  {
    name: 'Certificados Médicos y SC-4-04',
    url: '/assets/aistudio/Captura_de_pantalla_2026-11-02_a_las_12.52.03_p._m._604ffb16.png',
  },
  {
    name: 'Escala Salarial 24 Grupos',
    url: '/assets/aistudio/Captura_de_pantalla_2026-11-02_a_las_12.52.40_p._m._9fe1112d.png',
  },
  {
    name: 'Matriz RBAC (47 Permisos)',
    url: '/assets/aistudio/Captura_de_pantalla_2026-11-02_a_las_12.53.19_p._m._42527c6f.png',
  },
];

export const CreateArticleModal: React.FC = () => {
  const {
    isArticleModalOpen,
    articleToEdit,
    preselectedCategoryId,
    categories,
    closeArticleModal,
    addArticle,
    updateArticle,
  } = useHelpCenter();

  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [readTimeMinutes, setReadTimeMinutes] = useState(4);
  const [tagsInput, setTagsInput] = useState('');
  const [sections, setSections] = useState<ArticleSection[]>([]);

  useEffect(() => {
    if (articleToEdit) {
      setCategoryId(articleToEdit.categoryId);
      setTitle(articleToEdit.title);
      setSubtitle(articleToEdit.subtitle || '');
      setReadTimeMinutes(articleToEdit.readTimeMinutes || 4);
      setTagsInput(articleToEdit.tags.join(', '));
      setSections(articleToEdit.sections || []);
    } else {
      setCategoryId(preselectedCategoryId || categories[0]?.id || 'organizacion-entidades');
      setTitle('');
      setSubtitle('');
      setReadTimeMinutes(4);
      setTagsInput('Funcionalidad, Guía');
      setSections([
        {
          id: 'seccion-1',
          heading: '1. Introducción a la funcionalidad',
          content: 'Describe detalladamente el objetivo de esta funcionalidad y cómo resuelve los flujos de trabajo de los usuarios en SiteCorp.',
          callout: {
            type: 'info',
            title: 'Consejo inicial',
            text: 'Indica a los usuarios los requisitos previos o permisos necesarios antes de comenzar.',
          },
          image: {
            url: PRESET_SCREENSHOTS[0].url,
            caption: 'Captura de pantalla de la interfaz de la funcionalidad en SiteCorp.',
          },
        },
      ]);
    }
  }, [articleToEdit, preselectedCategoryId, categories, isArticleModalOpen]);

  if (!isArticleModalOpen) return null;

  const handleAddSection = () => {
    const newSec: ArticleSection = {
      id: `seccion-${Date.now()}`,
      heading: `${sections.length + 1}. Nuevo apartado de contenido`,
      content: 'Escribe aquí la explicación paso a paso o detalles operativos.',
    };
    setSections([...sections, newSec]);
  };

  const handleRemoveSection = (index: number) => {
    setSections(sections.filter((_, idx) => idx !== index));
  };

  const handleSectionChange = (index: number, field: keyof ArticleSection, value: unknown) => {
    setSections(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      if (dataUrl) {
        setSections(prev => {
          const copy = [...prev];
          copy[index] = {
            ...copy[index],
            image: {
              url: dataUrl,
              caption: file.name,
              alt: file.name,
            },
          };
          return copy;
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddCallout = (index: number) => {
    setSections(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        callout: {
          type: 'tip',
          title: 'Consejo Importante',
          text: 'Escribe una recomendación o nota clave aquí.',
        },
      };
      return copy;
    });
  };

  const handleAddSteps = (index: number) => {
    setSections(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        steps: [
          { number: 1, title: 'Accede al menú principal', description: 'Selecciona la opción en el panel lateral.' },
          { number: 2, title: 'Completa los campos requeridos', description: 'Rellena el formulario con los datos correspondientes.' },
          { number: 3, title: 'Guarda y confirma los cambios', description: 'Pulsa el botón de confirmación para sincronizar.' },
        ],
      };
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Por favor especifica un título para la página.');
      return;
    }
    if (!categoryId) {
      alert('Por favor selecciona una categoría / apartado.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const generatedSlug = (title || 'funcionalidad')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const articleData: Article = {
      id: articleToEdit ? articleToEdit.id : `${generatedSlug}-${Date.now().toString().slice(-4)}`,
      categoryId,
      title,
      subtitle,
      excerpt: subtitle || (sections[0]?.content.slice(0, 150) ?? ''),
      author: ADMIN_AUTHOR, // Always standardized to Administrador
      readTimeMinutes: Number(readTimeMinutes) || 4,
      updatedAt: articleToEdit?.updatedAt || 'Recién publicado',
      tags,
      helpfulVotes: articleToEdit?.helpfulVotes || { yes: 1, no: 0 },
      sections,
    };

    if (articleToEdit) {
      updateArticle(articleData);
    } else {
      addArticle(articleData);
    }

    closeArticleModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 overflow-y-auto max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-xl font-bold text-[#123F55]">
              {articleToEdit ? 'Editar Página de Funcionalidad' : 'Crear Nueva Página de Funcionalidad'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Redacta documentación técnica, pasos guiados y sube capturas de los módulos de SiteCorp. Autor asignado: <strong>Administrador</strong>.
            </p>
          </div>
          <button
            onClick={closeArticleModal}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          
          {/* Category & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Apartado / Módulo <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Título de la Funcionalidad <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Cómo registrar partes de trabajo diarios y fotos de obra"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91] font-semibold text-slate-900"
              />
            </div>
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subtítulo / Resumen Explicativo
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Ej. Guía paso a paso para supervisores de obra y encargados técnicos en campo."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91]"
            />
          </div>

          {/* Metadata: Author display (fixed as Administrador), Reading Time, Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#F0F6F9] border border-[#B8D6E3] text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Autor de la guía</label>
              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-slate-700 font-semibold">
                <img
                  src="/brand/isotipo-sitecorp.png"
                  alt="admin"
                  className="w-4 h-4 object-contain"
                />
                <span>Administrador</span>
              </div>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tiempo de lectura (min)</label>
              <input
                type="number"
                min={1}
                max={60}
                value={readTimeMinutes}
                onChange={(e) => setReadTimeMinutes(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Etiquetas (separadas por coma)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Obras, PRL, Reportes"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md"
              />
            </div>
          </div>

          {/* Sections Builder (Images and Text) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#123F55]">
                Bloques de Contenido (Texto, Imágenes y Guías)
              </h4>
              <button
                type="button"
                onClick={handleAddSection}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#F0F9FB] text-[#1A7B91] hover:bg-[#D6F0F5] rounded-lg text-xs font-semibold transition-colors border border-[#AEE1EC]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir otra sección</span>
              </button>
            </div>

            {sections.map((section, sIdx) => (
              <div
                key={section.id}
                className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <input
                    type="text"
                    value={section.heading}
                    onChange={(e) => handleSectionChange(sIdx, 'heading', e.target.value)}
                    placeholder="Encabezado de la sección (ej. 1. Configuración de parámetros)"
                    className="flex-1 font-bold text-sm text-slate-900 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91]"
                  />
                  {sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSection(sIdx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                      title="Eliminar este bloque"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Section Content Paragraph */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Texto explicativo
                  </label>
                  <textarea
                    rows={4}
                    value={section.content}
                    onChange={(e) => handleSectionChange(sIdx, 'content', e.target.value)}
                    placeholder="Escribe la explicación detallada..."
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91]"
                  />
                </div>

                {/* Image Configuration */}
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#1A7B91]" />
                      Imagen / Captura de Pantalla
                    </span>
                    {section.image && (
                      <button
                        type="button"
                        onClick={() => handleSectionChange(sIdx, 'image', undefined)}
                        className="text-rose-500 hover:text-rose-700 text-xs"
                      >
                        Quitar imagen
                      </button>
                    )}
                  </div>

                  {section.image ? (
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={section.image.url}
                          alt="preview"
                          className="w-24 h-16 object-cover rounded border border-slate-300"
                        />
                        <div className="flex-1 space-y-1">
                          <input
                            type="text"
                            value={section.image.url}
                            onChange={(e) => {
                              const newImg = { ...section.image!, url: e.target.value };
                              handleSectionChange(sIdx, 'image', newImg);
                            }}
                            placeholder="URL de la imagen o ruta interna"
                            className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded font-mono"
                          />
                          <input
                            type="text"
                            value={section.image.caption || ''}
                            onChange={(e) => {
                              const newImg = { ...section.image!, caption: e.target.value };
                              handleSectionChange(sIdx, 'image', newImg);
                            }}
                            placeholder="Pie de foto explicativo..."
                            className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <span className="text-slate-400 text-[11px]">Elegir captura de SiteCorp:</span>
                      {PRESET_SCREENSHOTS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            handleSectionChange(sIdx, 'image', {
                              url: preset.url,
                              caption: preset.name,
                            });
                          }}
                          className="px-2 py-1 bg-white border border-slate-200 hover:border-[#1A7B91] rounded text-slate-700 text-[11px]"
                        >
                          {preset.name}
                        </button>
                      ))}

                      <label className="cursor-pointer px-2 py-1 bg-[#FEF8F0] text-[#D88224] hover:bg-[#FDEEDC] border border-[#FBDEB9] rounded text-[11px] font-semibold flex items-center gap-1">
                        <Upload className="w-3 h-3 text-[#F49D37]" />
                        Subir captura propia
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(sIdx, e)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Extra Block Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {!section.callout && (
                    <button
                      type="button"
                      onClick={() => handleAddCallout(sIdx)}
                      className="px-2.5 py-1 text-xs text-slate-600 hover:text-[#123F55] bg-slate-100 hover:bg-[#F0F6F9] rounded-md transition-colors flex items-center gap-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-[#1A7B91]" />
                      <span>+ Cuadro de llamada (Consejo / Nota)</span>
                    </button>
                  )}

                  {!section.steps && (
                    <button
                      type="button"
                      onClick={() => handleAddSteps(sIdx)}
                      className="px-2.5 py-1 text-xs text-slate-600 hover:text-[#123F55] bg-slate-100 hover:bg-[#F0F6F9] rounded-md transition-colors flex items-center gap-1"
                    >
                      <ListOrdered className="w-3.5 h-3.5 text-[#1A7B91]" />
                      <span>+ Lista de Pasos Numerados</span>
                    </button>
                  )}
                </div>

                {/* Callout Editor if added */}
                {section.callout && (
                  <div className="p-3 bg-[#FEF8F0] border border-[#FBDEB9] rounded-lg text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#8A4E1A]">Cuadro de llamada</span>
                      <button
                        type="button"
                        onClick={() => handleSectionChange(sIdx, 'callout', undefined)}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        Eliminar llamada
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <select
                        value={section.callout.type}
                        onChange={(e) => {
                          const val = e.target.value as CalloutType;
                          handleSectionChange(sIdx, 'callout', { ...section.callout!, type: val });
                        }}
                        className="px-2 py-1 bg-white border border-[#FBDEB9] rounded"
                      >
                        <option value="tip">Consejo (Verde)</option>
                        <option value="info">Información (Azul)</option>
                        <option value="warning">Advertencia (Ámbar)</option>
                        <option value="alert">Alerta (Rojo)</option>
                      </select>
                      <input
                        type="text"
                        value={section.callout.title || ''}
                        onChange={(e) => {
                          handleSectionChange(sIdx, 'callout', { ...section.callout!, title: e.target.value });
                        }}
                        placeholder="Título del cuadro..."
                        className="col-span-2 px-2 py-1 bg-white border border-[#FBDEB9] rounded"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={section.callout.text}
                      onChange={(e) => {
                        handleSectionChange(sIdx, 'callout', { ...section.callout!, text: e.target.value });
                      }}
                      placeholder="Texto del aviso o recomendación..."
                      className="w-full px-2 py-1 bg-white border border-[#FBDEB9] rounded"
                    />
                  </div>
                )}

              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeArticleModal}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#123F55] hover:bg-[#0F3447] rounded-lg shadow-xs transition-colors"
            >
              {articleToEdit ? 'Guardar Cambios de la Página' : 'Publicar Página de Funcionalidad'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
