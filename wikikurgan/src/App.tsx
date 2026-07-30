import { useState, useEffect } from 'react';
import type { Article, Language, Category } from './types/wiki';
import { fetchArticles, saveArticle } from './services/api';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { WikiArticle } from './components/WikiArticle';
import { ArticleForm } from './components/ArticleForm';
import { SearchModal } from './components/SearchModal';
import { Sparkles, Info, ShieldCheck, Gamepad2 } from 'lucide-react';
import './App.css';

export function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeSlug, setActiveSlug] = useState<string>('cyberkurgan');
  const [currentLang, setCurrentLang] = useState<Language>('uz');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [linkNotice, setLinkNotice] = useState<string | null>(null);

  // Load articles on mount and when language changes
  useEffect(() => {
    loadArticles();
  }, [currentLang]);

  const loadArticles = async () => {
    const list = await fetchArticles(currentLang);
    setArticles(list);
  };

  const handleNavigate = (slug: string) => {
    setActiveSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Show friendly notice if user navigated to Islom
    if (slug === 'islom') {
      setLinkNotice("Siz O'yin matnidagi [[Islom]] Wikipedia havolasi orqali Islom qahramoni sahifasiga o'tdingiz!");
      setTimeout(() => setLinkNotice(null), 6000);
    }
  };

  const handleSaveArticle = async (articleToSave: Article) => {
    const saved = await saveArticle(articleToSave);
    await loadArticles();
    setIsAddModalOpen(false);
    setEditingArticle(null);
    setActiveSlug(saved.slug);
  };

  const currentArticle = articles.find((a) => a.slug.toLowerCase() === activeSlug.toLowerCase()) || articles[0];

  const filteredArticles = selectedCategory === 'all'
    ? articles
    : articles.filter((art) => art.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white flex flex-col">
      
      {/* Top Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAddArticle={() => {
          setEditingArticle(null);
          setIsAddModalOpen(true);
        }}
        onNavigateHome={() => handleNavigate('cyberkurgan')}
        onNavigateSlug={handleNavigate}
      />

      {/* Internal Navigation Toast Notification */}
      {linkNotice && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 text-slate-950 px-4 py-2 text-center text-xs font-bold shadow-lg flex items-center justify-center space-x-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{linkNotice}</span>
        </div>
      )}

      {/* Sub-Header Banner */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Gamepad2 className="w-4 h-4 text-cyan-400" />
            <span>Kiber-O'yinlar va Qahramonlar Rasmiy Wikipedia Portali</span>
          </div>
          <div className="hidden sm:flex items-center space-x-3">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Tasdiqlangan kontent</span>
            <span>|</span>
            <span className="text-amber-400 font-medium">Asosiy Qahramon: <strong>Islom</strong></span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar */}
          <Sidebar
            articles={filteredArticles}
            activeSlug={activeSlug}
            currentLang={currentLang}
            onNavigate={handleNavigate}
            onSelectCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
          />

          {/* Main Article Content */}
          <section className="flex-1 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm">
            {currentArticle ? (
              <WikiArticle
                article={currentArticle}
                articles={articles}
                currentLang={currentLang}
                onNavigate={handleNavigate}
                onEdit={(art) => {
                  setEditingArticle(art);
                  setIsAddModalOpen(true);
                }}
                onBackHome={() => handleNavigate('cyberkurgan')}
              />
            ) : (
              <div className="text-center py-16">
                <Info className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-300">Maqola topilmadi</h3>
                <p className="text-xs text-slate-500 mt-1">Tanlangan slug bo'yicha ma'lumot mavjud emas.</p>
                <button
                  onClick={() => handleNavigate('cyberkurgan')}
                  className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-xl text-xs font-semibold"
                >
                  Asosiy o'yin maqolasiga o'tish
                </button>
              </div>
            )}
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">WikiKurgan</span>
            <span>© 2026 O'yin va Qahramonlar ensiklopediyasi</span>
          </div>
          <p className="text-[11px] text-slate-500">
            TypeScript, React va Django REST Framework (SQLite) asosida tayyorlandi.
          </p>
        </div>
      </footer>

      {/* Modals */}
      {isAddModalOpen && (
        <ArticleForm
          initialArticle={editingArticle}
          currentLang={currentLang}
          onSave={handleSaveArticle}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingArticle(null);
          }}
        />
      )}

      <SearchModal
        isOpen={isSearchOpen}
        articles={articles}
        currentLang={currentLang}
        onClose={() => setIsSearchOpen(false)}
        onSelectArticle={handleNavigate}
      />

    </div>
  );
}

export default App;
