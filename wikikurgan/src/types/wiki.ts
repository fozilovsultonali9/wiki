export type Language = 'uz' | 'en' | 'ru';

export type Category = 'game' | 'character' | 'location' | 'item' | 'faction' | 'lore';

export interface InfoboxProperty {
  label: string;
  value: string;
}

export interface InfoboxData {
  title: string;
  subtitle?: string;
  image?: string;
  caption?: string;
  details: Record<string, string>;
  stats?: Record<string, string | number>;
}

export interface TranslationContent {
  title: string;
  summary: string;
  content: string;
  infobox?: InfoboxData;
}

export interface Article {
  id: string;
  slug: string;
  category: Category;
  gameName: string;
  defaultLanguage: Language;
  translations: {
    uz: TranslationContent;
    en?: TranslationContent;
    ru?: TranslationContent;
  };
  views?: number;
  createdAt: string;
  updatedAt: string;
  author?: string;
}

export interface QuickLinkMatch {
  title: string;
  slug: string;
  category: Category;
  summary: string;
  image?: string;
}
