import React, { useState } from 'react';
import type { Article, Language } from '../types/wiki';
import { Sparkles, ArrowRight, Shield, User, MapPin, Sword, Box } from 'lucide-react';

interface WikiParserProps {
  content: string;
  articles: Article[];
  currentLang: Language;
  onNavigate: (slug: string) => void;
}

interface HoverState {
  article: Article | null;
  x: number;
  y: number;
}

export const WikiParser: React.FC<WikiParserProps> = ({ content, articles, currentLang, onNavigate }) => {
  const [hoverState, setHoverState] = useState<HoverState | null>(null);

  // Helper to map article titles and slugs for fast matching
  const articleMap = React.useMemo(() => {
    const map = new Map<string, Article>();
    articles.forEach((art) => {
      map.set(art.slug.toLowerCase(), art);

      // Add titles across languages
      Object.values(art.translations).forEach((trans) => {
        if (trans && trans.title) {
          map.set(trans.title.toLowerCase(), art);
          // Also set simple first-word names (e.g., "Islom" from "Islom (Qahramon)")
          const baseName = trans.title.split(' ')[0].replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
          if (baseName && baseName.length > 2) {
            if (!map.has(baseName)) map.set(baseName, art);
          }
        }
      });
    });
    return map;
  }, [articles]);

  const handleMouseEnter = (e: React.MouseEvent, art: Article) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverState({
      article: art,
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY - 10,
    });
  };

  const handleMouseLeave = () => {
    setHoverState(null);
  };

  // Helper icon by category
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'character':
        return <User className="w-3.5 h-3.5 text-amber-400 inline mr-1" />;
      case 'location':
        return <MapPin className="w-3.5 h-3.5 text-emerald-400 inline mr-1" />;
      case 'item':
        return <Sword className="w-3.5 h-3.5 text-cyan-400 inline mr-1" />;
      case 'game':
        return <Shield className="w-3.5 h-3.5 text-purple-400 inline mr-1" />;
      default:
        return <Box className="w-3.5 h-3.5 text-slate-400 inline mr-1" />;
    }
  };

  // Render processed text line by line
  const parseWikiSyntax = (rawText: string) => {
    const lines = rawText.split('\n');
    const elements: React.ReactNode[] = [];

    lines.forEach((line, lineIdx) => {
      let trimmed = line.trim();

      // Heading 2 == Heading ==
      if (trimmed.startsWith('== ') && trimmed.endsWith(' ==')) {
        const title = trimmed.substring(3, trimmed.length - 3);
        const headingId = title.toLowerCase().replace(/\s+/g, '-');
        elements.push(
          <h2 key={`line-${lineIdx}`} id={headingId} className="wiki-heading-2">
            <span>{title}</span>
          </h2>
        );
        return;
      }

      // Heading 3 === Heading ===
      if (trimmed.startsWith('=== ') && trimmed.endsWith(' ===')) {
        const title = trimmed.substring(4, trimmed.length - 4);
        elements.push(
          <h3 key={`line-${lineIdx}`} className="wiki-heading-3">
            {title}
          </h3>
        );
        return;
      }

      // Blockquote <blockquote>...</blockquote>
      if (trimmed.startsWith('<blockquote>') && trimmed.endsWith('</blockquote>')) {
        const quoteContent = trimmed.substring(12, trimmed.length - 13);
        elements.push(
          <blockquote key={`line-${lineIdx}`} className="wiki-blockquote">
            {renderInlineWithLinks(quoteContent, lineIdx)}
          </blockquote>
        );
        return;
      }

      // Bullet items * item
      if (trimmed.startsWith('* ')) {
        const bulletText = trimmed.substring(2);
        elements.push(
          <li key={`line-${lineIdx}`} className="wiki-bullet-item">
            {renderInlineWithLinks(bulletText, lineIdx)}
          </li>
        );
        return;
      }

      // Empty line spacing
      if (trimmed === '') {
        elements.push(<div key={`line-${lineIdx}`} className="h-4" />);
        return;
      }

      // Standard paragraph
      elements.push(
        <p key={`line-${lineIdx}`} className="wiki-paragraph">
          {renderInlineWithLinks(line, lineIdx)}
        </p>
      );
    });

    return elements;
  };

  // Parse inline [[WikiLinks]] and '''bold''' styling
  const renderInlineWithLinks = (text: string, keyPrefix: number) => {
    // Regex for [[Link]] or [[Target|Display]]
    const parts = text.split(/(\[\[[^\]]+\]\]|'''[^']*'''|''[^']*'')/);

    return parts.map((part, idx) => {
      if (!part) return null;

      // Handle [[Link]]
      if (part.startsWith('[[') && part.endsWith(']]')) {
        const rawLink = part.substring(2, part.length - 2);
        let targetName = rawLink;
        let displayName = rawLink;

        if (rawLink.includes('|')) {
          const split = rawLink.split('|');
          targetName = split[0];
          displayName = split[1];
        }

        const matchedArticle = articleMap.get(targetName.toLowerCase());
        const slug = matchedArticle ? matchedArticle.slug : targetName.toLowerCase().replace(/\s+/g, '-');

        return (
          <span
            key={`link-${keyPrefix}-${idx}`}
            className={`wiki-inline-link ${matchedArticle ? 'wiki-link-active' : 'wiki-link-missing'}`}
            onClick={() => onNavigate(slug)}
            onMouseEnter={(e) => matchedArticle && handleMouseEnter(e, matchedArticle)}
            onMouseLeave={handleMouseLeave}
            title={matchedArticle ? `${matchedArticle.category.toUpperCase()}: ${displayName}` : 'Maʻlumot yoʻq'}
          >
            {matchedArticle && getCategoryIcon(matchedArticle.category)}
            <span className="underline font-medium">{displayName}</span>
          </span>
        );
      }

      // Handle '''Bold'''
      if (part.startsWith("'''") && part.endsWith("'''")) {
        const boldText = part.substring(3, part.length - 3);
        return <strong key={`bold-${keyPrefix}-${idx}`} className="font-bold text-slate-100">{boldText}</strong>;
      }

      // Handle ''Italic''
      if (part.startsWith("''") && part.endsWith("''")) {
        const italicText = part.substring(2, part.length - 2);
        return <em key={`italic-${keyPrefix}-${idx}`} className="italic text-slate-300">{italicText}</em>;
      }

      return <span key={`txt-${keyPrefix}-${idx}`}>{part}</span>;
    });
  };

  const activeTrans = hoverState?.article?.translations[currentLang] || hoverState?.article?.translations['uz'];

  return (
    <div className="relative wiki-parsed-container">
      {parseWikiSyntax(content)}

      {/* Floating Wikipedia Hover Preview Modal */}
      {hoverState && hoverState.article && activeTrans && (
        <div
          className="fixed z-50 w-80 bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 rounded-xl shadow-2xl p-4 text-slate-200 text-sm transition-all duration-200 pointer-events-none transform -translate-y-full mb-2"
          style={{
            left: `${Math.min(window.innerWidth - 340, Math.max(10, hoverState.x - 100))}px`,
            top: `${hoverState.y}px`,
          }}
        >
          <div className="flex items-center space-x-2 border-b border-slate-700/60 pb-2 mb-2">
            {getCategoryIcon(hoverState.article.category)}
            <span className="font-semibold text-cyan-300 truncate">{activeTrans.title}</span>
            <span className="ml-auto text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 border border-cyan-500/30">
              {hoverState.article.category}
            </span>
          </div>

          {activeTrans.infobox?.image && (
            <img
              src={activeTrans.infobox.image}
              alt={activeTrans.title}
              className="w-full h-32 object-cover rounded-lg mb-2 border border-slate-800"
            />
          )}

          <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
            {activeTrans.summary}
          </p>

          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-cyan-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Wikipedia O'yin Hujjatlari
            </span>
            <span className="flex items-center gap-0.5 font-medium">
              Batafsil <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
