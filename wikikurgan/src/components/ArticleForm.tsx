import React, { useState } from 'react';
import type { Article, Category, Language, TranslationContent } from '../types/wiki';
import { X, Save, HelpCircle, Sparkles, Image } from 'lucide-react';

interface ArticleFormProps {
  initialArticle?: Article | null;
  currentLang: Language;
  onSave: (article: Article) => void;
  onClose: () => void;
}

export const ArticleForm: React.FC<ArticleFormProps> = ({
  initialArticle,
  currentLang,
  onSave,
  onClose,
}) => {
  const isEdit = Boolean(initialArticle);

  const existingTrans = initialArticle?.translations[currentLang] || initialArticle?.translations['uz'] || {
    title: '',
    summary: '',
    content: '',
  };

  const [title, setTitle] = useState(existingTrans.title || '');
  const [slug, setSlug] = useState(initialArticle?.slug || '');
  const [category, setCategory] = useState<Category>(initialArticle?.category || 'character');
  const [gameName, setGameName] = useState(initialArticle?.gameName || 'CyberKurgan: Legend of Islom');
  const [summary, setSummary] = useState(existingTrans.summary || '');
  const [content, setContent] = useState(existingTrans.content || '');
  const [imageUrl, setImageUrl] = useState(existingTrans.infobox?.image || '');
  const [subtitle, setSubtitle] = useState(existingTrans.infobox?.subtitle || '');
  const [role, setRole] = useState(existingTrans.infobox?.details?.["Rol"] || existingTrans.infobox?.details?.["Role"] || '');

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEdit && !slug) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !content.trim()) {
      alert("Iltimos, Sarlavha, Slug va Maqola matnini to'liq kiriting!");
      return;
    }

    const cleanSlug = slug.toLowerCase().replace(/\s+/g, '-');

    const updatedTranslation: TranslationContent = {
      title,
      summary,
      content,
      infobox: {
        title,
        subtitle: subtitle || `${category.toUpperCase()} Ma'lumoti`,
        image: imageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
        details: {
          "Rol / Turi": role || "Qahramon",
          "O'yin nomi": gameName,
          "Kategoriya": category.toUpperCase(),
        },
        stats: {
          "Holati": "Faol",
          "Kiritilgan sana": new Date().toLocaleDateString()
        }
      }
    };

    const newArticle: Article = {
      id: initialArticle?.id || `art-${Date.now()}`,
      slug: cleanSlug,
      category,
      gameName,
      defaultLanguage: currentLang,
      createdAt: initialArticle?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      translations: {
        ...(initialArticle?.translations || { uz: updatedTranslation }),
        [currentLang]: updatedTranslation,
      }
    };

    onSave(newArticle);
  };

  const insertLinkSyntax = (textToInsert: string) => {
    setContent((prev) => prev + ` [[${textToInsert}]]`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">
              {isEdit ? "Ma'lumotni Tahrirlash" : "Yangi Ma'lumot Qo'shish (O'yin / Qahramon)"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs text-slate-300">
          
          {/* Row 1: Title & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-200 mb-1">
                Sarlavha (Nomi) *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Masalan: Islom (Qahramon) yoki CyberKurgan"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-200 mb-1">
                Slug (Havola kalit so'zi) *
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="islom, cyberkurgan, plazma-qilichi"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          {/* Row 2: Category & Game Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-200 mb-1">Kategoriya</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 text-xs"
              >
                <option value="character">Qahramon (Character)</option>
                <option value="game">O'yin (Game)</option>
                <option value="location">Joy / Hudud (Location)</option>
                <option value="item">Qurol / Artefakt (Item)</option>
                <option value="faction">Tashkilot (Faction)</option>
                <option value="lore">Afsona (Lore)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-200 mb-1">O'yin Nomi</label>
              <input
                type="text"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                placeholder="CyberKurgan: Legend of Islom"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 text-xs"
              />
            </div>
          </div>

          {/* Row 3: Infobox Settings */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <h3 className="font-bold text-cyan-400 flex items-center gap-1.5">
              <Image className="w-4 h-4" /> Infobox (O'ng tarafdagi Wikipedia jadvali)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Rasm URL havola</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Sub-sarlavha</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Bosh Qahramon / Kiber-RPG"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Rol / Xususiyat</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Protagonist, Neyro-Jangchi"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Row 4: Summary */}
          <div>
            <label className="block font-semibold text-slate-200 mb-1">Qisqacha mazmun (Summary)</label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Ushbu qahramon yoki o'yin haqida qisqacha ta'rif..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 text-xs"
            />
          </div>

          {/* Row 5: Full Article Content */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-200">
                To'liq Maqola Matni (Wikipedia Sintaksisi) *
              </label>
              <div className="flex items-center space-x-1">
                <span className="text-[11px] text-slate-400 mr-1">Tezkor linklar:</span>
                <button
                  type="button"
                  onClick={() => insertLinkSyntax('Islom')}
                  className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-semibold hover:bg-amber-500/30"
                >
                  + [[Islom]]
                </button>
                <button
                  type="button"
                  onClick={() => insertLinkSyntax('Aleksey')}
                  className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-semibold hover:bg-blue-500/30"
                >
                  + [[Aleksey]]
                </button>
                <button
                  type="button"
                  onClick={() => insertLinkSyntax('Plazma Qilichi')}
                  className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-semibold hover:bg-cyan-500/30"
                >
                  + [[Plazma Qilichi]]
                </button>
              </div>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              placeholder={`== Sarlavha ==\nMatn ichiga [[Islom]] yoki [[Aleksey]] ko'rinishida Wikipedia havolalari kiritishingiz mumkin.\n\n* Bullet 1\n* Bullet 2`}
              className="w-full px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500 leading-relaxed"
              required
            />
            <p className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-cyan-400 shrink-0" /> Escalation syntax: <code>== Sarlavha ==</code>, <code>'''Qalin'''</code>, <code>[[Boshqa Sahifa]]</code>
            </p>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-medium text-xs transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center space-x-1.5 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Saqlash</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
