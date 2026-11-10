export type CalloutType = 'tip' | 'info' | 'warning' | 'alert';

export interface CalloutBlock {
  type: CalloutType;
  title?: string;
  text: string;
}

export interface StepItem {
  number: number;
  title: string;
  description: string;
}

export interface TableBlock {
  headers: string[];
  rows: string[][];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ArticleSection {
  id: string;
  heading: string;
  content: string;
  callout?: CalloutBlock;
  image?: {
    url: string;
    caption?: string;
    alt?: string;
  };
  steps?: StepItem[];
  table?: TableBlock;
  faqItems?: FAQItem[];
}

export interface Author {
  name: string;
  role: string;
  avatar: string;
}

export interface Article {
  id: string;
  categoryId: string;
  title: string;
  subtitle: string;
  excerpt: string;
  author: Author;
  readTimeMinutes: number;
  updatedAt: string;
  isFeatured?: boolean;
  tags: string[];
  helpfulVotes: {
    yes: number;
    no: number;
  };
  sections: ArticleSection[];
}

export interface Category {
  id: string;
  title: string;
  shortDescription: string;
  icon: string;
  accentColor: 'blue' | 'indigo' | 'emerald' | 'amber' | 'cyan' | 'purple' | 'slate';
  order: number;
  badge?: string;
}

export type ViewState = 
  | { type: 'home' }
  | { type: 'category'; categoryId: string }
  | { type: 'article'; articleId: string; categoryId: string };
