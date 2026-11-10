import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, FileText, CornerDownLeft } from 'lucide-react';
import { useHelpCenter } from '../context/HelpCenterContext';

export const HeroSearch: React.FC = () => {
  const { articles, categories, goToArticle, goToCategory } = useHelpCenter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut listener ('/' or 'Ctrl+K')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key === 'k')) && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter matching articles
  const trimmed = query.trim().toLowerCase();
  const matchingArticles = trimmed
    ? articles.filter(art => {
        const inTitle = art.title.toLowerCase().includes(trimmed);
        const inSubtitle = art.subtitle.toLowerCase().includes(trimmed);
        const inExcerpt = art.excerpt.toLowerCase().includes(trimmed);
        const inTags = art.tags.some(t => t.toLowerCase().includes(trimmed));
        const inContent = art.sections.some(s => s.content.toLowerCase().includes(trimmed) || s.heading.toLowerCase().includes(trimmed));
        return inTitle || inSubtitle || inExcerpt || inTags || inContent;
      }).slice(0, 7)
    : [];

  const handleSelectArticle = (articleId: string, categoryId: string) => {
    setIsOpen(false);
    setQuery('');
    goToArticle(articleId, categoryId);
  };

  const getCategoryTitle = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.title || 'General';
  };

  return (
    <div className="relative bg-gradient-to-b from-[#F0F6F9] via-white to-slate-50 border-b border-slate-200/80 py-14 sm:py-18 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        
        {/* Anti-slop: clean editorial title matching SiteCorp branding */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#B8D6E3] rounded-full text-xs font-semibold text-[#123F55] mb-4 shadow-2xs">
          <span>Base de Conocimiento y Guías Oficiales</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#123F55] text-balance">
          Centro de Ayuda SiteCorp
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto text-balance">
          Documentación técnica, guías de configuración y respuestas paso a paso para todos los módulos de tu organización.
        </p>

        {/* Search Bar Container */}
        <div className="relative mt-8">
          <div className="relative flex items-center bg-white rounded-xl border-2 border-slate-200 shadow-sm focus-within:border-[#1A7B91] focus-within:ring-3 focus-within:ring-[#1A7B91]/15 transition-all">
            <div className="pl-4 text-[#1A7B91]">
              <Search className="w-5 h-5" />
            </div>
            
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Buscar por módulo, Anexo 14B, vacaciones (+1.92), plantillas Word, roles..."
              className="w-full py-4 pl-3 pr-20 text-slate-900 placeholder-slate-400 text-sm sm:text-base focus:outline-none bg-transparent font-medium"
            />

            <div className="absolute right-3 flex items-center gap-2">
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    inputRef.current?.focus();
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 text-[11px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded">
                /
              </kbd>
            </div>
          </div>

          {/* Live Search Results Dropdown */}
          {isOpen && trimmed.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-50 text-left max-h-[460px] overflow-y-auto"
            >
              <div className="px-4 py-2.5 bg-[#F0F6F9] border-b border-slate-200 text-xs font-semibold text-[#123F55] uppercase tracking-wider flex items-center justify-between">
                <span>Resultados ({matchingArticles.length})</span>
                <span className="flex items-center gap-1 font-normal lowercase text-slate-500">
                  <CornerDownLeft className="w-3 h-3" /> para abrir
                </span>
              </div>

              {matchingArticles.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <p className="text-sm">No se encontraron artículos que coincidan con &ldquo;{query}&rdquo;.</p>
                  <p className="text-xs text-slate-400 mt-1">Prueba con palabras como &ldquo;vacaciones&rdquo;, &ldquo;plantilla&rdquo; o &ldquo;escala&rdquo;.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {matchingArticles.map((article) => {
                    const catTitle = getCategoryTitle(article.categoryId);
                    return (
                      <button
                        key={article.id}
                        onClick={() => handleSelectArticle(article.id, article.categoryId)}
                        className="w-full p-4 hover:bg-[#F0F6F9]/80 transition-colors flex items-start justify-between group text-left focus:outline-none focus:bg-[#F0F6F9]"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 text-[#1A7B91] shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs text-[#1A7B91] font-semibold mb-0.5">
                              {catTitle}
                            </div>
                            <div className="text-sm font-semibold text-[#123F55] group-hover:text-[#1A7B91] transition-colors">
                              {article.title}
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                              {article.subtitle || article.excerpt}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#F49D37] group-hover:translate-x-0.5 transition-all shrink-0 ml-4 mt-1" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Topics Jump (Zero-pill text buttons) */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
          <span className="font-medium text-slate-400">Temas destacados:</span>
          {categories.slice(0, 5).map((cat) => (
            <button
              key={cat.id}
              onClick={() => goToCategory(cat.id)}
              className="text-[#123F55] hover:text-[#F49D37] underline underline-offset-4 decoration-slate-300 hover:decoration-[#F49D37] transition-colors py-1 px-1.5 focus:outline-none font-medium"
            >
              {cat.title}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
