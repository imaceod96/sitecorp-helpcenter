import React from 'react';
import { HelpCenterProvider, useHelpCenter } from './context/HelpCenterContext';
import { Header } from './components/Header';
import { AdminBar } from './components/AdminBar';
import { HeroSearch } from './components/HeroSearch';
import { CategoryCard } from './components/CategoryCard';
import { CategoryDetailView } from './components/CategoryDetailView';
import { ArticleView } from './components/ArticleView';
import { CreateCategoryModal } from './components/CreateCategoryModal';
import { CreateArticleModal } from './components/CreateArticleModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { UserManagerModal } from './components/UserManagerModal';
import { SupportModal } from './components/SupportModal';
import { ImageLightboxModal } from './components/ImageLightboxModal';
import { Footer } from './components/Footer';
import {
  Sparkles,
  Plus,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    viewState,
    categories,
    articles,
    goToArticle,
    isAdminMode,
    openCategoryModal,
    authNotification,
    clearAuthNotification,
  } = useHelpCenter();

  // Featured articles
  const featuredArticles = articles.filter(a => a.isFeatured).slice(0, 3);

  return (
    <main className="min-h-screen flex flex-col bg-slate-50/60">
      <AdminBar />
      <Header />

      {/* Signed URL Toast / Notification Banner */}
      {authNotification && (
        <div className="bg-[#0F3447] text-white px-4 py-2.5 shadow-md flex items-center justify-between text-xs animate-in fade-in duration-300">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-emerald-300">{authNotification}</span>
          </div>
          <button
            onClick={clearAuthNotification}
            className="text-slate-300 hover:text-white p-1 ml-4 focus:outline-none"
            aria-label="Cerrar aviso"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex-1">
        {viewState.type === 'home' && (
          <div>
            {/* Viterbit-style Hero with prominent Search */}
            <HeroSearch />

            {/* Featured Guides Banner */}
            {featuredArticles.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-4 mb-3 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#123F55] uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-[#F49D37]" />
                      <span>Guías Destacadas y Novedades</span>
                    </div>
                    <span className="text-xs text-slate-400">
                      Documentación oficial por Administrador
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {featuredArticles.map((art) => {
                      const cat = categories.find(c => c.id === art.categoryId);
                      return (
                        <button
                          key={art.id}
                          onClick={() => goToArticle(art.id, art.categoryId)}
                          className="text-left p-3.5 rounded-lg hover:bg-[#F0F6F9] transition-all border border-slate-100 hover:border-[#B8D6E3] group flex flex-col justify-between focus:outline-none"
                        >
                          <div>
                            <div className="text-[11px] font-semibold text-[#1A7B91] mb-1">
                              {cat?.title || 'General'}
                            </div>
                            <h4 className="text-sm font-bold text-[#123F55] group-hover:text-[#1A7B91] transition-colors line-clamp-2">
                              {art.title}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                              {art.subtitle || art.excerpt}
                            </p>
                          </div>
                          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                            <span>{art.readTimeMinutes} min de lectura</span>
                            <span className="text-[#F49D37] group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5 font-semibold">
                              Leer guía <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* Collections Grid (Apartados de funcionalidades) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#123F55]">
                    Explora por Apartados y Módulos
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Colecciones temáticas estructuradas para resolver tus dudas de manera ágil.
                  </p>
                </div>

                {isAdminMode && (
                  <button
                    onClick={() => openCategoryModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-[#123F55] hover:bg-[#0F3447] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4 text-[#F49D37]" />
                    <span>+ Crear Nuevo Apartado</span>
                  </button>
                )}
              </div>

              {/* Grid of Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>

              {categories.length === 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-800">No hay apartados creados todavía</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Inicia sesión como Administrador para crear tu primera sección y añadir documentación.
                  </p>
                  {isAdminMode && (
                    <button
                      onClick={() => openCategoryModal()}
                      className="mt-4 px-4 py-2 bg-[#123F55] text-white rounded-lg text-xs font-semibold hover:bg-[#0F3447]"
                    >
                      Crear apartado
                    </button>
                  )}
                </div>
              )}

            </section>

          </div>
        )}

        {viewState.type === 'category' && (
          <CategoryDetailView categoryId={viewState.categoryId} />
        )}

        {viewState.type === 'article' && (
          <ArticleView articleId={viewState.articleId} categoryId={viewState.categoryId} />
        )}
      </div>

      <Footer />

      {/* Admin, Authentication and Utility Modals */}
      <CreateCategoryModal />
      <CreateArticleModal />
      <AdminLoginModal />
      <UserManagerModal />
      <SupportModal />
      <ImageLightboxModal />
    </main>
  );
};

export default function App() {
  return (
    <HelpCenterProvider>
      <MainContent />
    </HelpCenterProvider>
  );
}
