import React from 'react';
import { Category } from '../types/helpCenter';
import { useHelpCenter } from '../context/HelpCenterContext';
import { renderCategoryIcon } from '../utils/iconMap';
import { FileText, ArrowRight, Edit2, Trash2, Plus } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const {
    articles,
    goToCategory,
    goToArticle,
    isAdminMode,
    openCategoryModal,
    deleteCategory,
    openArticleModal,
  } = useHelpCenter();

  const categoryArticles = articles.filter(a => a.categoryId === category.id);
  const articleCount = categoryArticles.length;

  const getAccentColorClasses = (color: Category['accentColor']) => {
    switch (color) {
      case 'amber':
        return {
          bg: 'bg-[#FEF8F0] text-[#D88224] border-[#FBDEB9]',
          hoverBorder: 'hover:border-[#F49D37]',
        };
      case 'emerald':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
          hoverBorder: 'hover:border-emerald-300',
        };
      case 'cyan':
        return {
          bg: 'bg-[#F0F9FB] text-[#1A7B91] border-[#AEE1EC]',
          hoverBorder: 'hover:border-[#1A7B91]',
        };
      case 'indigo':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-100',
          hoverBorder: 'hover:border-indigo-300',
        };
      case 'purple':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-100',
          hoverBorder: 'hover:border-purple-300',
        };
      case 'blue':
      default:
        return {
          bg: 'bg-[#F0F6F9] text-[#123F55] border-[#B8D6E3]',
          hoverBorder: 'hover:border-[#1A7B91]',
        };
    }
  };

  const accent = getAccentColorClasses(category.accentColor);

  return (
    <div className={`relative bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs transition-all duration-200 flex flex-col justify-between ${accent.hoverBorder} hover:shadow-md group`}>
      
      {/* Top Admin Controls if Admin Mode Active */}
      {isAdminMode && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-1 z-10 shadow-xs">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openCategoryModal(category);
            }}
            className="p-1.5 text-slate-500 hover:text-[#123F55] hover:bg-white rounded transition-colors"
            title="Editar esta sección"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteCategory(category.id);
            }}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-white rounded transition-colors"
            title="Eliminar esta sección"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openArticleModal(undefined, category.id);
            }}
            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-white rounded transition-colors"
            title="Añadir artículo a esta sección"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div>
        {/* Category Header */}
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${accent.bg}`}>
            {renderCategoryIcon(category.icon, 'w-6 h-6')}
          </div>
          <div className="flex-1 pr-14">
            <h3
              onClick={() => goToCategory(category.id)}
              className="text-lg font-bold text-[#123F55] group-hover:text-[#1A7B91] transition-colors cursor-pointer"
            >
              {category.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              {category.shortDescription}
            </p>
          </div>
        </div>

        {/* Metadata unboxed text (anti-slop rule) */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100">
          <span className="font-semibold text-slate-700 tabular-nums">
            {articleCount} {articleCount === 1 ? 'artículo' : 'artículos'}
          </span>
          {category.badge && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-[#1A7B91] font-semibold">{category.badge}</span>
            </>
          )}
        </div>

        {/* Top 3 articles list preview */}
        <div className="mt-4 space-y-2">
          {categoryArticles.slice(0, 3).map((art) => (
            <button
              key={art.id}
              onClick={() => goToArticle(art.id, category.id)}
              className="w-full text-left flex items-start gap-2.5 p-2 rounded-lg hover:bg-[#F0F6F9] text-slate-700 hover:text-[#123F55] transition-colors text-xs font-medium group/art focus:outline-none"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400 group-hover/art:text-[#1A7B91] mt-0.5 shrink-0" />
              <span className="line-clamp-1 flex-1">{art.title}</span>
              <ArrowRight className="w-3 h-3 text-transparent group-hover/art:text-[#F49D37] shrink-0 mt-0.5 transition-colors" />
            </button>
          ))}

          {categoryArticles.length === 0 && (
            <p className="text-xs text-slate-400 italic py-2">
              No hay artículos creados aún en esta sección.
            </p>
          )}
        </div>
      </div>

      {/* Card Footer: Standardized "Por Administrador" + View All button */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <img
            src="/brand/isotipo-sitecorp.png"
            alt="Administrador"
            className="w-5 h-5 rounded-full ring-1 ring-slate-200 object-contain p-0.5 bg-white"
          />
          <span className="text-slate-600 font-medium">Por Administrador</span>
        </div>

        <button
          onClick={() => goToCategory(category.id)}
          className="font-semibold text-[#1A7B91] hover:text-[#123F55] flex items-center gap-1 focus:outline-none"
        >
          <span>Ver colección</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#F49D37]" />
        </button>
      </div>

    </div>
  );
};
