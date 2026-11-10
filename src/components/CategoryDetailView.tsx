import React, { useState } from 'react';
import { useHelpCenter } from '../context/HelpCenterContext';
import { renderCategoryIcon } from '../utils/iconMap';
import {
  ChevronRight,
  ArrowLeft,
  FileText,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Search,
  ThumbsUp,
} from 'lucide-react';

interface CategoryDetailViewProps {
  categoryId: string;
}

export const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({ categoryId }) => {
  const {
    categories,
    articles,
    goToHome,
    goToArticle,
    isAdminMode,
    openCategoryModal,
    deleteCategory,
    openArticleModal,
    deleteArticle,
  } = useHelpCenter();

  const [categorySearch, setCategorySearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const category = categories.find(c => c.id === categoryId);

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Sección no encontrada</h2>
        <p className="text-sm text-slate-500 mt-2">
          El apartado que buscas ha sido modificado o eliminado.
        </p>
        <button
          onClick={goToHome}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-[#123F55] text-white rounded-lg text-sm font-medium hover:bg-[#0F3447] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Inicio
        </button>
      </div>
    );
  }

  const categoryArticles = articles.filter(a => a.categoryId === category.id);

  // Extract all tags in this category
  const allTags = Array.from(new Set(categoryArticles.flatMap(a => a.tags)));

  // Filter articles
  const filteredArticles = categoryArticles.filter(art => {
    const matchesSearch =
      categorySearch.trim() === '' ||
      art.title.toLowerCase().includes(categorySearch.toLowerCase()) ||
      art.subtitle.toLowerCase().includes(categorySearch.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(categorySearch.toLowerCase());
    const matchesTag = selectedTag === 'all' || art.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <button
          onClick={goToHome}
          className="hover:text-[#123F55] transition-colors font-medium focus:outline-none"
        >
          Centro de Ayuda
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-semibold truncate">{category.title}</span>
      </nav>

      {/* Category Hero / Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-xs mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-xl bg-[#F0F6F9] text-[#123F55] border border-[#B8D6E3] flex items-center justify-center shrink-0">
              {renderCategoryIcon(category.icon, 'w-8 h-8')}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#123F55] tracking-tight">
                  {category.title}
                </h1>
                {category.badge && (
                  <span className="text-xs text-[#1A7B91] font-semibold bg-[#F0F9FB] border border-[#AEE1EC] px-2.5 py-0.5 rounded-full">
                    {category.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 mt-2 max-w-2xl">
                {category.shortDescription}
              </p>
              
              {/* Unboxed Metadata */}
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-4">
                <span className="font-semibold text-slate-700 tabular-nums">
                  {categoryArticles.length} artículos en total
                </span>
                <span aria-hidden="true">·</span>
                <span>Documentación oficial por Administrador</span>
              </div>
            </div>
          </div>

          {/* Admin actions for this category if Admin mode is active */}
          {isAdminMode && (
            <div className="flex flex-wrap items-center gap-2 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
              <button
                onClick={() => openArticleModal(undefined, category.id)}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#123F55] hover:bg-[#0F3447] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4 text-[#F49D37]" />
                <span>Nuevo Artículo</span>
              </button>
              <button
                onClick={() => openCategoryModal(category)}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                title="Editar este apartado"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteCategory(category.id)}
                className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-medium transition-colors"
                title="Eliminar este apartado"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Internal Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            placeholder="Filtrar artículos de esta sección..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#1A7B91] focus:ring-1 focus:ring-[#1A7B91]/20"
          />
        </div>

        {/* Tag Filters (Segmented Control Buttons) */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-3 py-1 font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                selectedTag === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({categoryArticles.length})
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  selectedTag === tag
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Articles List */}
      <div className="space-y-3">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => goToArticle(article.id, category.id)}
            className="bg-white rounded-xl border border-slate-200/90 p-5 hover:border-[#1A7B91] hover:shadow-xs transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4 flex-1">
              <div className="w-10 h-10 rounded-lg bg-[#F0F6F9] text-[#123F55] flex items-center justify-center shrink-0 group-hover:bg-[#123F55] group-hover:text-white transition-colors mt-0.5">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#123F55] transition-colors">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {article.subtitle || article.excerpt}
                </p>

                {/* Metadata Line */}
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                  <span className="text-[#123F55] font-semibold">Administrador</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTimeMinutes} min
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{article.updatedAt}</span>
                  {article.helpfulVotes && article.helpfulVotes.yes > 0 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <ThumbsUp className="w-3 h-3" />
                        {article.helpfulVotes.yes}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right side: Arrow or Admin Action buttons */}
            <div className="flex items-center gap-2 shrink-0 sm:self-center">
              {isAdminMode && (
                <div
                  className="flex items-center gap-1 mr-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => openArticleModal(article, category.id)}
                    className="p-1.5 text-slate-500 hover:text-[#123F55] hover:bg-slate-100 rounded-md transition-colors"
                    title="Editar artículo"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteArticle(article.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-md transition-colors"
                    title="Eliminar artículo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="text-slate-300 group-hover:text-[#F49D37] group-hover:translate-x-1 transition-all">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}

        {filteredArticles.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-slate-800">
              No hay artículos en esta selección
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {categorySearch
                ? 'No encontramos coincidencias para tu búsqueda. Intenta con otros términos.'
                : 'Esta sección aún no tiene contenido publicado.'}
            </p>
            {isAdminMode && (
              <button
                onClick={() => openArticleModal(undefined, category.id)}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#123F55] text-white rounded-lg text-xs font-semibold hover:bg-[#0F3447] transition-colors"
              >
                <Plus className="w-4 h-4 text-[#F49D37]" />
                <span>Crear primer artículo ahora</span>
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
