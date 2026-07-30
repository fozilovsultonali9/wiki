import React from 'react';
import type { Article, Language } from '../types/wiki';
import { WikiParser } from './WikiParser';
import { Infobox } from './Infobox';
import { Clock, Eye, Edit, List, Shield, User, MapPin, Sword, Tag, ArrowLeft } from 'lucide-react';

interface WikiArticleProps {
  article: Article;
  articles: Article[];
  currentLang: Language;
  onNavigate: (slug: string) => void;
  onEdit: (article: Article) => void;
  onBackHome: () => void;
}

export const WikiArticle: React.FC<WikiArticleProps> = ({
  article,
  articles,
  currentLang,
  onNavigate,
  onEdit,
  onBackHome,
}) => {
  const translation = article.translations[currentLang] || article.translations['uz'] || article.translations['en'];

  // Extract Table of Contents from content
  const tableOfContents = React.useMemo(() => {
    if (!translation || !translation.content) return [];
    const lines = translation.content.split('\n');
    const toc: { id: string; title: string }[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('== ') && trimmed.endsWith(' ==')) {
        const title = trimmed.substring(3, trimmed.length - 3);
        const id = title.toLowerCase().replace(/\s+/g, '-');
        toc.push({ id, title });
      }
    });

    return toc;
  }, [translation]);

  if (!translation) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
        <p className="text-lg font-semibold text-slate-300">Ushbu dilda ma'lumot topilmadi.</p>
        <button
          onClick={onBackHome}
          className="mt-4 px-4 py-2 bg-cyan-600 text-white text-xs font-semibold rounded-lg hover:bg-cyan-500 transition-colors"
        >
          Asosiy sahifaga qaytish
        </button>
      </div>
    );
  }

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'character':
        return <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-semibold"><User className="w-3.5 h-3.5" /> Qahramon</span>;
      case 'game':
        return <span className="flex items-center gap-1 text-purple-400 bg-purple-500/10 border border-purple-500/30 px-2.5 py-1 rounded-full text-xs font-semibold"><Shield className="w-3.5 h-3.5" /> O'yin</span>;
      case 'location':
        return <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full text-xs font-semibold"><MapPin className="w-3.5 h-3.5" /> Joy / Hudud</span>;
      case 'item':
        return <span className="flex items-center gap-1 text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-full text-xs font-semibold"><Sword className="w-3.5 h-3.5" /> Qurol / Artefakt</span>;
      default:
        return <span className="flex items-center gap-1 text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full text-xs font-semibold"><Tag className="w-3.5 h-3.5" /> Ma'lumot</span>;
    }
  };

  return (
    <article className="max-w-5xl mx-auto space-y-6">
      {/* Top Bar with Navigation & Actions */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <button
          onClick={onBackHome}
          className="flex items-center space-x-1.5 text-slate-400 hover:text-cyan-400 text-xs font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Bosh Sahifa</span>
        </button>

        <div className="flex items-center space-x-2">
          {getCategoryBadge(article.category)}
          
          <button
            onClick={() => onEdit(article)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 text-xs font-medium transition-all"
          >
            <Edit className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tahrirlash</span>
          </button>
        </div>
      </div>

      {/* Article Title */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight border-b border-slate-800 pb-3">
          {translation.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-cyan-400" /> O'yin: <strong className="text-slate-200 ml-1">{article.gameName}</strong>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" /> Yangilangan: {new Date(article.updatedAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-slate-500" /> Ko'rishlar: {article.views || 100}
          </span>
        </div>
      </div>

      {/* Summary Box */}
      {translation.summary && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-cyan-500/30 text-slate-300 text-sm leading-relaxed shadow-lg">
          <p className="font-medium text-slate-200">
            <strong className="text-cyan-400 mr-2">Qisqacha:</strong> {translation.summary}
          </p>
        </div>
      )}

      {/* Content Layout with Infobox */}
      <div className="clearfix">
        {/* Render Infobox on the right side if present */}
        {translation.infobox && (
          <Infobox data={translation.infobox} category={article.category} />
        )}

        {/* Table of Contents */}
        {tableOfContents.length > 0 && (
          <div className="my-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 max-w-sm inline-block shadow-md">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
              <List className="w-4 h-4 text-cyan-400" /> Mundarija (Table of Contents)
            </h3>
            <ol className="space-y-1 text-xs text-slate-300 list-decimal list-inside">
              {tableOfContents.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="hover:text-cyan-400 font-medium transition-colors"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Article Parsed Body */}
        <div className="mt-4 text-slate-300 leading-relaxed space-y-4">
          <WikiParser
            content={translation.content}
            articles={articles}
            currentLang={currentLang}
            onNavigate={onNavigate}
          />
        </div>
      </div>

      {/* Article Footer & Categories */}
      <div className="mt-12 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-300">Kategoriya:</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
            {article.category.toUpperCase()}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
            {article.gameName}
          </span>
        </div>

        <p className="text-[11px] text-slate-500">
          Ushbu maqola WikiKurgan hamjamiyati tomonidan Wikipedia standartlariga muvofiq tayyorlangan.
        </p>
      </div>
    </article>
  );
};
