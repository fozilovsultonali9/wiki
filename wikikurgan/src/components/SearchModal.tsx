import React, { useState, useEffect } from 'react';
import type { Article, Language } from '../types/wiki';
import { Search, X, Shield, User, MapPin, Sword, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  articles: Article[];
  currentLang: Language;
  onClose: () => void;
  onSelectArticle: (slug: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  articles,
  currentLang,
  onClose,
  onSelectArticle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = articles.filter((art) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const trans = art.translations[currentLang] || art.translations['uz'];
    return (
      trans?.title.toLowerCase().includes(q) ||
      trans?.summary.toLowerCase().includes(q) ||
      art.slug.toLowerCase().includes(q) ||
      art.gameName.toLowerCase().includes(q)
    );
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'character':
        return <User className="w-4 h-4 text-amber-400" />;
      case 'location':
        return <MapPin className="w-4 h-4 text-emerald-400" />;
      case 'item':
        return <Sword className="w-4 h-4 text-cyan-400" />;
      default:
        return <Shield className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Input Header */}
        <div className="flex items-center px-4 py-3 border-b border-slate-800 bg-slate-950">
          <Search className="w-5 h-5 text-cyan-400 mr-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Wikipedia qidiruvi (masalan: Islom, Plazma Qilichi, Toshkent)..."
            className="w-full bg-transparent text-white focus:outline-none text-sm placeholder-slate-500"
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 rounded text-slate-500 hover:text-slate-300 text-xs mr-2"
            >
              Tozalash
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/60">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Siz qidirgan <strong>"{searchTerm}"</strong> bo'yicha ma'lumot topilmadi.
            </div>
          ) : (
            filtered.map((art) => {
              const trans = art.translations[currentLang] || art.translations['uz'];
              return (
                <div
                  key={art.id}
                  onClick={() => {
                    onSelectArticle(art.slug);
                    onClose();
                  }}
                  className="p-3 hover:bg-slate-800/70 rounded-xl cursor-pointer transition-colors group flex items-start justify-between"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 mt-0.5">
                      {getCategoryIcon(art.category)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                          {trans?.title}
                        </h4>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                          {art.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {trans?.summary}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0 mt-2" />
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Qidirish natijalari: {filtered.length} ta maqola</span>
          <span>Tanlash uchun maqolani bosing</span>
        </div>

      </div>
    </div>
  );
};
