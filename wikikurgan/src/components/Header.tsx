import React from 'react';
import type { Language } from '../types/wiki';
import { BookOpen, Search, PlusCircle, Globe, Shield, User } from 'lucide-react';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenSearch: () => void;
  onOpenAddArticle: () => void;
  onNavigateHome: () => void;
  onNavigateSlug: (slug: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  onOpenSearch,
  onOpenAddArticle,
  onNavigateHome,
  onNavigateSlug,
}) => {
  const languageNames: Record<Language, { label: string; flag: string }> = {
    uz: { label: "O'zbekcha", flag: '🇺🇿' },
    en: { label: 'English', flag: '🇬🇧' },
    ru: { label: 'Русский', flag: '🇷🇺' },
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={onNavigateHome}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-amber-300 bg-clip-text text-transparent">
                WIKI<span className="text-white">KURGAN</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                O'YIN WIKI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">O'yinlar va Qahramonlar Ensiklopediyasi</p>
          </div>
        </div>

        {/* Central Search Trigger */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all text-xs shadow-inner group"
          >
            <span className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>O'yin yoki qahramon haqida qidirish (masalan: Islom)...</span>
            </span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-400 rounded border border-slate-700">
              Ctrl + K
            </kbd>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {/* Quick links */}
          <div className="hidden lg:flex items-center space-x-1 border-r border-slate-800 pr-3">
            <button
              onClick={() => onNavigateSlug('cyberkurgan')}
              className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-cyan-400 font-medium flex items-center gap-1 rounded-lg hover:bg-slate-900 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" /> O'yin
            </button>
            <button
              onClick={() => onNavigateSlug('islom')}
              className="px-2.5 py-1.5 text-xs text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
            >
              <User className="w-3.5 h-3.5 text-amber-400" /> Islom (Qahramon)
            </button>
          </div>

          {/* Add Article Button ("Ma'lumot qo'shish") */}
          <button
            onClick={onOpenAddArticle}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 flex items-center space-x-1.5 transition-all hover:scale-105 active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">Ma'lumot qo'shish</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative group">
            <button className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-medium transition-all">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>{languageNames[currentLang].flag} {languageNames[currentLang].label}</span>
            </button>
            
            <div className="absolute right-0 mt-1 w-36 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50">
              {(['uz', 'en', 'ru'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onLanguageChange(lang)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center space-x-2 transition-colors ${
                    currentLang === lang ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{languageNames[lang].flag}</span>
                  <span>{languageNames[lang].label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
