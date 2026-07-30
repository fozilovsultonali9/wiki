import React from 'react';
import type { Article, Language, Category } from '../types/wiki';
import { Home, Shield, User, MapPin, Sword, Sparkles, Shuffle, Star, Bookmark } from 'lucide-react';

interface SidebarProps {
  articles: Article[];
  activeSlug: string;
  currentLang: Language;
  onNavigate: (slug: string) => void;
  onSelectCategory: (category: Category | 'all') => void;
  selectedCategory: Category | 'all';
}

export const Sidebar: React.FC<SidebarProps> = ({
  articles,
  activeSlug,
  currentLang,
  onNavigate,
  onSelectCategory,
  selectedCategory,
}) => {
  const handleRandom = () => {
    if (articles.length === 0) return;
    const randomIndex = Math.floor(Math.random() * articles.length);
    onNavigate(articles[randomIndex].slug);
  };

  const categories: { id: Category | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: "Barchasi", icon: <Bookmark className="w-3.5 h-3.5" /> },
    { id: 'game', label: "O'yinlar", icon: <Shield className="w-3.5 h-3.5 text-purple-400" /> },
    { id: 'character', label: "Qahramonlar", icon: <User className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'location', label: "Joylar", icon: <MapPin className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'item', label: "Qurollar", icon: <Sword className="w-3.5 h-3.5 text-cyan-400" /> },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6">
      
      {/* Navigation Card */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
          Wikipedia Menyusi
        </h3>
        
        <button
          onClick={() => onNavigate('cyberkurgan')}
          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSlug === 'cyberkurgan'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Home className="w-4 h-4 text-cyan-400" />
          <span>Bosh O'yin Maqolasi</span>
        </button>

        <button
          onClick={handleRandom}
          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
        >
          <Shuffle className="w-4 h-4 text-purple-400" />
          <span>Tasodifiy Maqola</span>
        </button>
      </div>

      {/* Hero Character Spotlight (Islom) */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/40 shadow-xl space-y-3 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Star className="w-3 h-3 text-amber-400" /> Bosh Qahramon
          </span>
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
        </div>

        <div>
          <h4 className="text-base font-extrabold text-amber-200">Islom (Qahramon)</h4>
          <p className="text-[11px] text-slate-300 line-clamp-2 mt-1 leading-relaxed">
            Plazma Qilichi ustasi, CyberKurgan olamidagi afsonaviy kiber-jangchi.
          </p>
        </div>

        <button
          onClick={() => onNavigate('islom')}
          className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold text-xs shadow-md transition-transform active:scale-95 flex items-center justify-center space-x-1"
        >
          <User className="w-3.5 h-3.5" />
          <span>Islom Sahifasiga O'tish</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
          Kategoriyalar
        </h3>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              selectedCategory === cat.id
                ? 'bg-slate-800 text-white font-semibold border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span className="flex items-center space-x-2">
              {cat.icon}
              <span>{cat.label}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Quick Articles List */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
          Barcha Maqolalar ({articles.length})
        </h3>
        <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
          {articles.map((art) => {
            const trans = art.translations[currentLang] || art.translations['uz'];
            const isActive = activeSlug === art.slug;
            return (
              <button
                key={art.id}
                onClick={() => onNavigate(art.slug)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-cyan-400'
                }`}
              >
                <span className="truncate">{trans?.title || art.slug}</span>
                {art.slug === 'islom' && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" title="Bosh Qahramon" />
                )}
              </button>
            );
          })}
        </div>
      </div>

    </aside>
  );
};
