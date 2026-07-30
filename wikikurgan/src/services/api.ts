import type { Article, Language } from '../types/wiki';
import { INITIAL_ARTICLES } from '../data/initialData';

const API_BASE_URL = 'http://127.0.0.1:8000/api/articles/';
const LOCAL_STORAGE_KEY = 'wikikurgan_articles_v1';

// Initialize local storage if empty
export const getLocalArticles = (): Article[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('LocalStorage read error:', e);
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_ARTICLES));
  return INITIAL_ARTICLES;
};

export const saveLocalArticles = (articles: Article[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(articles));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
};

export const fetchArticles = async (lang: Language = 'uz', query?: string): Promise<Article[]> => {
  try {
    const url = new URL(API_BASE_URL);
    url.searchParams.append('lang', lang);
    if (query) url.searchParams.append('search', query);

    const res = await fetch(url.toString(), { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    // API not reachable or timed out, fallback to local storage
  }

  // Local storage search fallback
  let local = getLocalArticles();
  if (query) {
    const q = query.toLowerCase();
    local = local.filter((art) => {
      const t = art.translations[lang] || art.translations['uz'] || art.translations['en'];
      return (
        t.title.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        art.slug.toLowerCase().includes(q) ||
        art.gameName.toLowerCase().includes(q)
      );
    });
  }
  return local;
};

export const fetchArticleBySlug = async (slug: string, lang: Language = 'uz'): Promise<Article | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}${slug}/?lang=${lang}`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // fallback
  }

  const articles = getLocalArticles();
  const match = articles.find((a) => a.slug.toLowerCase() === slug.toLowerCase());
  return match || null;
};

export const saveArticle = async (article: Article): Promise<Article> => {
  const articles = getLocalArticles();
  const existingIdx = articles.findIndex((a) => a.id === article.id || a.slug === article.slug);

  let updated: Article;
  if (existingIdx >= 0) {
    updated = { ...article, updatedAt: new Date().toISOString() };
    articles[existingIdx] = updated;
  } else {
    updated = {
      ...article,
      id: article.id || `art-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0
    };
    articles.unshift(updated);
  }

  saveLocalArticles(articles);

  // Try saving to Django backend async
  try {
    await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
  } catch (e) {
    console.log('Django Backend offline, saved to localStorage locally.');
  }

  return updated;
};
