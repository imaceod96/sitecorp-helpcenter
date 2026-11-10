import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category, Article, ViewState } from '../types/helpCenter';
import { INITIAL_CATEGORIES, INITIAL_ARTICLES, ADMIN_AUTHOR } from '../data/initialData';
import { verifySignedToken } from '../utils/signedAuth';
import {
  AdminUser,
  getAdminUsers,
  authenticateAdmin,
  getCurrentAdminUser,
  clearCurrentAdminUser,
  changeUserPassword as apiChangeUserPassword,
  createNewAdminUser,
  deleteAdminUser as apiDeleteAdminUser,
  verifyAdminPassword,
} from '../utils/security';

const STORAGE_KEY_CATEGORIES = 'sitecorp_help_categories_v2';
const STORAGE_KEY_ARTICLES = 'sitecorp_help_articles_v2';
const STORAGE_KEY_ADMIN_AUTH = 'sitecorp_help_superadmin_auth';

interface HelpCenterContextType {
  categories: Category[];
  articles: Article[];
  viewState: ViewState;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Superadmin & Multi-user authentication
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  authNotification: string | null;
  clearAuthNotification: () => void;
  isAdminLoginModalOpen: boolean;
  setIsAdminLoginModalOpen: (open: boolean) => void;
  adminUsers: AdminUser[];
  currentAdminUser: AdminUser | null;
  loginWithCredentials: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsAdmin: (password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  updateUserPassword: (userId: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  addUser: (data: { email: string; name: string; role: AdminUser['role']; plainPassword: string }) => Promise<{ success: boolean; error?: string }>;
  removeUser: (userId: string) => { success: boolean; error?: string };
  isUserManagerModalOpen: boolean;
  openUserManagerModal: () => void;
  closeUserManagerModal: () => void;
  
  // Navigation
  goToHome: () => void;
  goToCategory: (categoryId: string) => void;
  goToArticle: (articleId: string, categoryId?: string) => void;

  // Category CRUD
  addCategory: (category: Omit<Category, 'order'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;

  // Article CRUD
  addArticle: (articleData: Omit<Article, 'updatedAt' | 'helpfulVotes'>) => void;
  updateArticle: (article: Article) => void;
  deleteArticle: (articleId: string) => void;

  // Article feedback
  voteArticle: (articleId: string, isHelpful: boolean) => void;
  votedArticles: Record<string, boolean>;

  // Data management
  resetToDefaults: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;

  // Category Modal
  isCategoryModalOpen: boolean;
  categoryToEdit: Category | null;
  openCategoryModal: (category?: Category) => void;
  closeCategoryModal: () => void;

  // Article Modal
  isArticleModalOpen: boolean;
  articleToEdit: Article | null;
  preselectedCategoryId: string | null;
  openArticleModal: (article?: Article, categoryId?: string) => void;
  closeArticleModal: () => void;

  // Lightbox & Support
  isSupportModalOpen: boolean;
  setIsSupportModalOpen: (open: boolean) => void;
  lightboxImage: { url: string; caption?: string } | null;
  openLightbox: (url: string, caption?: string) => void;
  closeLightbox: () => void;
}

const HelpCenterContext = createContext<HelpCenterContextType | undefined>(undefined);

export const HelpCenterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ARTICLES);
      if (saved) {
        const parsed: Article[] = JSON.parse(saved);
        // Ensure all authors are standardized to Administrador
        return parsed.map(a => ({
          ...a,
          author: ADMIN_AUTHOR,
        }));
      }
      return INITIAL_ARTICLES;
    } catch {
      return INITIAL_ARTICLES;
    }
  });

  // Check if superadmin is authenticated
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'true' || params.get('superadmin') === 'true') {
        localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
        return true;
      }
      return localStorage.getItem(STORAGE_KEY_ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [authNotification, setAuthNotification] = useState<string | null>(null);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isUserManagerModalOpen, setIsUserManagerModalOpen] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => getAdminUsers());
  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser | null>(() => getCurrentAdminUser());
  const [viewState, setViewState] = useState<ViewState>({ type: 'home' });
  const [searchQuery, setSearchQuery] = useState('');
  const [votedArticles, setVotedArticles] = useState<Record<string, boolean>>({});

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState<Article | null>(null);
  const [preselectedCategoryId, setPreselectedCategoryId] = useState<string | null>(null);

  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; caption?: string } | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Error saving categories', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(articles));
    } catch (e) {
      console.error('Error saving articles', e);
    }
  }, [articles]);

  // Check and verify signed link from app.sitecorp.cu on load
  useEffect(() => {
    const checkSignedLink = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const authToken = params.get('auth_token');
        const sig = params.get('sig');

        if (authToken && sig) {
          const res = await verifySignedToken(authToken, sig);
          if (res.valid) {
            setIsAdminMode(true);
            localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
            setAuthNotification(`Sesión iniciada como Superadmin (${res.email || 'app.sitecorp.cu'})`);
            // Clean URL query params to remove tokens from address bar
            const cleanUrl = window.location.pathname + window.location.hash;
            window.history.replaceState({}, document.title, cleanUrl);
          } else {
            setAuthNotification(`Acceso denegado: ${res.error || 'Token inválido'}`);
          }
        }
      } catch (err) {
        console.error('Error verificando enlace firmado', err);
      }
    };
    checkSignedLink();
  }, []);

  const clearAuthNotification = () => setAuthNotification(null);

  // Keyboard shortcut listener to discreetly open Superadmin Login: Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (isAdminMode) {
          setIsAdminMode(false);
          localStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
        } else {
          setIsAdminLoginModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminMode]);

  // Handle URL hash navigation for deep linking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash === 'admin' || hash === 'superadmin') {
        setIsAdminLoginModalOpen(true);
        return;
      }
      if (!hash) {
        setViewState({ type: 'home' });
        return;
      }
      const parts = hash.split('/');
      if (parts[0] === 'category' && parts[1]) {
        setViewState({ type: 'category', categoryId: parts[1] });
      } else if (parts[0] === 'article' && parts[1]) {
        const found = articles.find(a => a.id === parts[1]);
        setViewState({
          type: 'article',
          articleId: parts[1],
          categoryId: found ? found.categoryId : (parts[2] || 'organizacion-entidades')
        });
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [articles]);

  const goToHome = () => {
    window.location.hash = '';
    setViewState({ type: 'home' });
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToCategory = (categoryId: string) => {
    window.location.hash = `/category/${categoryId}`;
    setViewState({ type: 'category', categoryId });
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToArticle = (articleId: string, categoryId?: string) => {
    const targetCatId = categoryId || articles.find(a => a.id === articleId)?.categoryId || 'organizacion-entidades';
    window.location.hash = `/article/${articleId}`;
    setViewState({ type: 'article', articleId, categoryId: targetCatId });
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Superadmin & Multi-user authentication via cryptographic hash (no plain credentials in code)
  const loginWithCredentials = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const res = await authenticateAdmin(email, password);
    if (res.success && res.user) {
      setCurrentAdminUser(res.user);
      setIsAdminMode(true);
      try {
        localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
      } catch {}
      setIsAdminLoginModalOpen(false);
      setAuthNotification(`Sesión iniciada como ${res.user.name} (${res.user.email})`);
      setAdminUsers(getAdminUsers());
      return { success: true };
    }
    return { success: false, error: res.error || 'Credenciales inválidas' };
  };

  const loginAsAdmin = async (password: string): Promise<boolean> => {
    // Intenta autenticar con el usuario administrador por defecto
    const users = getAdminUsers();
    const defaultUser = users[0];
    const defaultEmail = defaultUser ? defaultUser.email : 'admin@sitecorp.local';
    const res = await authenticateAdmin(defaultEmail, password);
    if (res.success && res.user) {
      setCurrentAdminUser(res.user);
      setIsAdminMode(true);
      try {
        localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
      } catch {}
      setIsAdminLoginModalOpen(false);
      setAuthNotification(`Sesión iniciada como ${res.user.name}`);
      setAdminUsers(getAdminUsers());
      return true;
    }

    // Comprobación de respaldo contra cualquier clave de administrador registrada
    const isValid = await verifyAdminPassword(password);
    if (isValid) {
      setIsAdminMode(true);
      try {
        localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
      } catch {}
      setIsAdminLoginModalOpen(false);
      setAuthNotification('Modo Administrador activado');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminMode(false);
    clearCurrentAdminUser();
    setCurrentAdminUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
    } catch {}
  };

  const updateUserPassword = async (userId: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    const res = await apiChangeUserPassword(userId, newPassword);
    if (res.success) {
      setAdminUsers(getAdminUsers());
      const updatedCur = getCurrentAdminUser();
      if (updatedCur) {
        setCurrentAdminUser(updatedCur);
      }
    }
    return res;
  };

  const addUser = async (data: { email: string; name: string; role: AdminUser['role']; plainPassword: string }): Promise<{ success: boolean; error?: string }> => {
    const res = await createNewAdminUser(data);
    if (res.success) {
      setAdminUsers(getAdminUsers());
    }
    return res;
  };

  const removeUser = (userId: string): { success: boolean; error?: string } => {
    const res = apiDeleteAdminUser(userId);
    if (res.success) {
      setAdminUsers(getAdminUsers());
      const cur = getCurrentAdminUser();
      if (!cur || cur.id === userId) {
        setIsAdminMode(false);
        setCurrentAdminUser(null);
      }
    }
    return res;
  };

  const openUserManagerModal = () => setIsUserManagerModalOpen(true);
  const closeUserManagerModal = () => setIsUserManagerModalOpen(false);

  // Category Actions
  const addCategory = (categoryData: Omit<Category, 'order'>) => {
    const newCategory: Category = {
      ...categoryData,
      order: categories.length + 1,
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (updated: Category) => {
    setCategories(prev => prev.map(c => (c.id === updated.id ? updated : c)));
  };

  const deleteCategory = (categoryId: string) => {
    if (window.confirm('¿Seguro que deseas eliminar este apartado y desasociar sus artículos?')) {
      setCategories(prev => prev.filter(c => c.id !== categoryId));
      if (viewState.type === 'category' && viewState.categoryId === categoryId) {
        goToHome();
      }
    }
  };

  // Article Actions
  const addArticle = (articleData: Omit<Article, 'updatedAt' | 'helpfulVotes'>) => {
    const newArticle: Article = {
      ...articleData,
      author: ADMIN_AUTHOR,
      updatedAt: 'Recién publicado',
      helpfulVotes: { yes: 1, no: 0 },
    };
    setArticles(prev => [newArticle, ...prev]);
    goToArticle(newArticle.id, newArticle.categoryId);
  };

  const updateArticle = (updated: Article) => {
    setArticles(prev => prev.map(a => (a.id === updated.id ? { ...updated, author: ADMIN_AUTHOR, updatedAt: 'Actualizado hoy' } : a)));
  };

  const deleteArticle = (articleId: string) => {
    if (window.confirm('¿Seguro que deseas eliminar este artículo?')) {
      const art = articles.find(a => a.id === articleId);
      setArticles(prev => prev.filter(a => a.id !== articleId));
      if (viewState.type === 'article' && viewState.articleId === articleId) {
        if (art) {
          goToCategory(art.categoryId);
        } else {
          goToHome();
        }
      }
    }
  };

  // Feedback votes
  const voteArticle = (articleId: string, isHelpful: boolean) => {
    if (votedArticles[articleId] !== undefined) return;
    setVotedArticles(prev => ({ ...prev, [articleId]: isHelpful }));
    setArticles(prev => prev.map(art => {
      if (art.id !== articleId) return art;
      return {
        ...art,
        helpfulVotes: {
          yes: art.helpfulVotes.yes + (isHelpful ? 1 : 0),
          no: art.helpfulVotes.no + (!isHelpful ? 1 : 0),
        }
      };
    }));
  };

  // Reset to default
  const resetToDefaults = () => {
    if (window.confirm('¿Deseas restablecer todos los datos del Centro de Ayuda al contenido inicial de SiteCorp?')) {
      setCategories(INITIAL_CATEGORIES);
      setArticles(INITIAL_ARTICLES);
      localStorage.removeItem(STORAGE_KEY_CATEGORIES);
      localStorage.removeItem(STORAGE_KEY_ARTICLES);
      goToHome();
    }
  };

  const exportDataJSON = () => {
    const data = { categories, articles, exportedAt: new Date().toISOString() };
    return JSON.stringify(data, null, 2);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.categories) && Array.isArray(parsed.articles)) {
        const sanitizedArticles = parsed.articles.map((a: Article) => ({
          ...a,
          author: ADMIN_AUTHOR,
        }));
        setCategories(parsed.categories);
        setArticles(sanitizedArticles);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Invalid JSON', e);
      return false;
    }
  };

  // Category Modal Handlers
  const openCategoryModal = (category?: Category) => {
    setCategoryToEdit(category || null);
    setIsCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setCategoryToEdit(null);
  };

  // Article Modal Handlers
  const openArticleModal = (article?: Article, categoryId?: string) => {
    setArticleToEdit(article || null);
    setPreselectedCategoryId(categoryId || null);
    setIsArticleModalOpen(true);
  };

  const closeArticleModal = () => {
    setIsArticleModalOpen(false);
    setArticleToEdit(null);
    setPreselectedCategoryId(null);
  };

  const openLightbox = (url: string, caption?: string) => {
    setLightboxImage({ url, caption });
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  return (
    <HelpCenterContext.Provider
      value={{
        categories,
        articles,
        viewState,
        searchQuery,
        setSearchQuery,
        isAdminMode,
        setIsAdminMode,
        authNotification,
        clearAuthNotification,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        adminUsers,
        currentAdminUser,
        loginWithCredentials,
        loginAsAdmin,
        logoutAdmin,
        updateUserPassword,
        addUser,
        removeUser,
        isUserManagerModalOpen,
        openUserManagerModal,
        closeUserManagerModal,
        goToHome,
        goToCategory,
        goToArticle,
        addCategory,
        updateCategory,
        deleteCategory,
        addArticle,
        updateArticle,
        deleteArticle,
        voteArticle,
        votedArticles,
        resetToDefaults,
        exportDataJSON,
        importDataJSON,
        isCategoryModalOpen,
        categoryToEdit,
        openCategoryModal,
        closeCategoryModal,
        isArticleModalOpen,
        articleToEdit,
        preselectedCategoryId,
        openArticleModal,
        closeArticleModal,
        isSupportModalOpen,
        setIsSupportModalOpen,
        lightboxImage,
        openLightbox,
        closeLightbox,
      }}
    >
      {children}
    </HelpCenterContext.Provider>
  );
};

export const useHelpCenter = () => {
  const context = useContext(HelpCenterContext);
  if (!context) {
    throw new Error('useHelpCenter must be used within a HelpCenterProvider');
  }
  return context;
};
