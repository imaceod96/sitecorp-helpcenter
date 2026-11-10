import React, { useState, useEffect } from 'react';
import { useHelpCenter } from '../context/HelpCenterContext';
import {
  ChevronRight,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Check,
  Edit2,
  Trash2,
  ArrowRight,
  Maximize2,
  Info,
  Lightbulb,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';

interface ArticleViewProps {
  articleId: string;
  categoryId: string;
}

export const ArticleView: React.FC<ArticleViewProps> = ({ articleId, categoryId }) => {
  const {
    articles,
    categories,
    goToHome,
    goToCategory,
    goToArticle,
    voteArticle,
    votedArticles,
    isAdminMode,
    openArticleModal,
    deleteArticle,
    openLightbox,
  } = useHelpCenter();

  const [copiedLink, setCopiedLink] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [expandedFaqs, setExpandedFaqs] = useState<Record<string, boolean>>({});

  const article = articles.find(a => a.id === articleId);
  const category = categories.find(c => c.id === (article?.categoryId || categoryId));

  // Related articles in the same category
  const relatedArticles = articles
    .filter(a => a.categoryId === article?.categoryId && a.id !== articleId)
    .slice(0, 3);

  // Intersection observer for Table of Contents
  useEffect(() => {
    if (!article) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );

    article.sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [article]);

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Artículo no encontrado</h2>
        <p className="text-sm text-slate-500 mt-2">
          La guía o funcionalidad solicitada no existe o fue retirada.
        </p>
        <button
          onClick={goToHome}
          className="mt-6 px-4 py-2 bg-[#123F55] text-white rounded-lg text-sm font-medium hover:bg-[#0F3447] transition-colors"
        >
          Volver a la Base de Conocimiento
        </button>
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const toggleFaq = (key: string) => {
    setExpandedFaqs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const hasVoted = votedArticles[article.id] !== undefined;
  const userVote = votedArticles[article.id];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 overflow-x-auto whitespace-nowrap" aria-label="Breadcrumb">
        <button
          onClick={goToHome}
          className="hover:text-[#123F55] transition-colors font-medium focus:outline-none"
        >
          Centro de Ayuda
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        {category && (
          <>
            <button
              onClick={() => goToCategory(category.id)}
              className="hover:text-[#123F55] transition-colors font-medium focus:outline-none"
            >
              {category.title}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </>
        )}
        <span className="text-slate-900 font-semibold truncate max-w-xs sm:max-w-md">
          {article.title}
        </span>
      </nav>

      {/* Main 2-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Article Body (8 cols on desktop) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 shadow-xs">
          
          {/* Article Header */}
          <header className="border-b border-slate-100 pb-8 mb-8">
            <div className="flex items-center justify-between gap-4">
              {category && (
                <button
                  onClick={() => goToCategory(category.id)}
                  className="text-xs font-bold text-[#1A7B91] uppercase tracking-wider hover:underline focus:outline-none"
                >
                  {category.title}
                </button>
              )}

              {/* Admin Mode Toolbar if Admin Mode active */}
              {isAdminMode && (
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
                  <button
                    onClick={() => openArticleModal(article, article.categoryId)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-[#123F55] hover:bg-white rounded transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Editar Página</span>
                  </button>
                  <button
                    onClick={() => deleteArticle(article.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-white rounded transition-colors"
                    title="Eliminar artículo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#123F55] tracking-tight mt-3 text-balance">
              {article.title}
            </h1>

            {article.subtitle && (
              <p className="text-base sm:text-lg text-slate-600 mt-3 text-balance leading-relaxed">
                {article.subtitle}
              </p>
            )}

            {/* Author & Meta Line — Standardized to Administrador */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2.5">
                <img
                  src="/brand/isotipo-sitecorp.png"
                  alt="Administrador"
                  className="w-8 h-8 rounded-full object-contain p-1 ring-1 ring-slate-200 bg-white"
                />
                <div>
                  <div className="font-semibold text-slate-800">Administrador</div>
                  <div className="text-[11px] text-[#1A7B91] font-medium">Equipo SiteCorp</div>
                </div>
              </div>

              <span className="hidden sm:inline" aria-hidden="true">·</span>

              <div className="flex items-center gap-1 text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.readTimeMinutes} min de lectura</span>
              </div>

              <span className="hidden sm:inline" aria-hidden="true">·</span>

              <span>Actualizado: {article.updatedAt}</span>
            </div>

            {/* Tags (Zero-pill text separators) */}
            {article.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-4">
                <span className="text-slate-400 font-medium">Temas:</span>
                {article.tags.map((tag, idx) => (
                  <React.Fragment key={tag}>
                    <span className="text-slate-700 font-medium hover:text-[#1A7B91] transition-colors">
                      #{tag}
                    </span>
                    {idx < article.tags.length - 1 && <span aria-hidden="true">·</span>}
                  </React.Fragment>
                ))}
              </div>
            )}
          </header>

          {/* Article Sections */}
          <div className="space-y-10">
            {article.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="text-xl sm:text-2xl font-bold text-[#123F55] tracking-tight mb-4 text-balance">
                  {section.heading}
                </h2>

                {/* Content Paragraphs */}
                <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-6">
                  {section.content}
                </div>

                {/* Optional Image with Zoom Lightbox */}
                {section.image && (
                  <div className="my-6">
                    <div
                      onClick={() => openLightbox(section.image!.url, section.image!.caption)}
                      className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 cursor-zoom-in shadow-xs hover:border-[#1A7B91] transition-all"
                    >
                      <img
                        src={section.image.url}
                        alt={section.image.alt || section.heading}
                        className="w-full h-auto object-cover max-h-[460px] group-hover:scale-[1.01] transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white/90 backdrop-blur-xs text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5">
                          <Maximize2 className="w-3.5 h-3.5" />
                          Ampliar captura
                        </span>
                      </div>
                    </div>
                    {section.image.caption && (
                      <p className="text-xs text-slate-500 italic mt-2 text-center">
                        {section.image.caption}
                      </p>
                    )}
                  </div>
                )}

                {/* Callout Box */}
                {section.callout && (
                  <div
                    className={`my-6 rounded-xl p-4 sm:p-5 border text-sm leading-relaxed ${
                      section.callout.type === 'tip'
                        ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950'
                        : section.callout.type === 'warning'
                        ? 'bg-amber-50/70 border-amber-200/80 text-amber-950'
                        : section.callout.type === 'alert'
                        ? 'bg-rose-50/70 border-rose-200/80 text-rose-950'
                        : 'bg-[#F0F6F9] border-[#B8D6E3] text-[#0C2A3A]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {section.callout.type === 'tip' && <Lightbulb className="w-5 h-5 text-emerald-600" />}
                        {section.callout.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                        {section.callout.type === 'alert' && <AlertCircle className="w-5 h-5 text-rose-600" />}
                        {section.callout.type === 'info' && <Info className="w-5 h-5 text-[#1A7B91]" />}
                      </div>
                      <div className="flex-1">
                        {section.callout.title && (
                          <h4 className="font-bold text-xs uppercase tracking-wider mb-1 opacity-90">
                            {section.callout.title}
                          </h4>
                        )}
                        <p className="text-xs sm:text-sm">{section.callout.text}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step-by-Step Instructions */}
                {section.steps && section.steps.length > 0 && (
                  <div className="my-6 space-y-4">
                    {section.steps.map((step) => (
                      <div
                        key={step.number}
                        className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/80 border border-slate-200/70"
                      >
                        <div className="w-7 h-7 rounded-full bg-[#123F55] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                          {step.number}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 text-sm">
                            {step.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Structured Table */}
                {section.table && (
                  <div className="my-6 overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-[#F0F6F9] text-[#123F55] font-bold border-b border-slate-200">
                        <tr>
                          {section.table.headers.map((h, i) => (
                            <th key={i} className="px-4 py-3">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {section.table.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="px-4 py-3 text-slate-700">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Collapsible FAQ Accordion */}
                {section.faqItems && section.faqItems.length > 0 && (
                  <div className="my-6 space-y-3">
                    {section.faqItems.map((faq, fIdx) => {
                      const faqKey = `${section.id}-faq-${fIdx}`;
                      const isExpanded = !!expandedFaqs[faqKey];
                      return (
                        <div
                          key={faqKey}
                          className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50"
                        >
                          <button
                            onClick={() => toggleFaq(faqKey)}
                            className="w-full px-4 py-3.5 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-800 hover:text-[#1A7B91] transition-colors focus:outline-none"
                          >
                            <span className="flex items-center gap-2">
                              <HelpCircle className="w-4 h-4 text-[#1A7B91] shrink-0" />
                              {faq.question}
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 text-slate-400 transition-transform ${
                                isExpanded ? 'rotate-180 text-[#1A7B91]' : ''
                              }`}
                            />
                          </button>
                          {isExpanded && (
                            <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-100 bg-white leading-relaxed">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

              </section>
            ))}
          </div>

          {/* Feedback Section (Helpfulness Rating) */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="bg-[#F0F6F9] rounded-xl p-6 text-center border border-[#B8D6E3]">
              <h3 className="text-base font-bold text-[#123F55]">
                ¿Te ha resultado útil este artículo?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Tus valoraciones nos ayudan a mejorar continuamente la documentación de SiteCorp.
              </p>

              {hasVoted ? (
                <div className="mt-4 inline-flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg text-xs font-semibold">
                  <Check className="w-4 h-4" />
                  <span>¡Gracias por tu opinión! ({userVote ? 'Votado: Útil' : 'Votado: No útil'})</span>
                </div>
              ) : (
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => voteArticle(article.id, true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4 text-emerald-600" />
                    <span>Sí ({article.helpfulVotes.yes})</span>
                  </button>
                  <button
                    onClick={() => voteArticle(article.id, false)}
                    className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <ThumbsDown className="w-4 h-4 text-rose-500" />
                    <span>No ({article.helpfulVotes.no})</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Sticky Table of Contents & Quick Actions (4 cols on desktop) */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          
          {/* Table of Contents Box */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
            <h3 className="text-xs font-bold text-[#123F55] uppercase tracking-wider mb-3">
              En esta página
            </h3>
            <nav className="space-y-1">
              {article.sections.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className={`block text-xs py-1.5 px-2 rounded-md transition-colors ${
                    activeSectionId === sec.id
                      ? 'bg-[#F0F6F9] text-[#123F55] font-bold border-l-2 border-[#1A7B91]'
                      : 'text-slate-600 hover:text-[#123F55] hover:bg-slate-50'
                  }`}
                >
                  {sec.heading}
                </a>
              ))}
            </nav>
          </div>

          {/* Quick Share / Export Actions */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
            <h3 className="text-xs font-bold text-[#123F55] uppercase tracking-wider mb-3">
              Acciones de la página
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors focus:outline-none"
              >
                <span className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-slate-400" />
                  {copiedLink ? '¡Enlace copiado!' : 'Copiar enlace directo'}
                </span>
                {copiedLink && <Check className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                onClick={() => window.print()}
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors focus:outline-none"
              >
                <span>Imprimir / Guardar en PDF</span>
              </button>
            </div>
          </div>

          {/* Related Articles in this category */}
          {relatedArticles.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-[#123F55] uppercase tracking-wider mb-3">
                Artículos relacionados
              </h3>
              <div className="divide-y divide-slate-100">
                {relatedArticles.map((rel) => (
                  <button
                    key={rel.id}
                    onClick={() => goToArticle(rel.id, rel.categoryId)}
                    className="w-full py-2.5 text-left group flex items-start justify-between gap-2 focus:outline-none"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-800 group-hover:text-[#1A7B91] transition-colors line-clamp-2">
                        {rel.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {rel.readTimeMinutes} min de lectura
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#F49D37] shrink-0 mt-1 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

        </aside>

      </div>

    </div>
  );
};
