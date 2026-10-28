export const locales = ['en', 'ml', 'hi', 'ta'] as const;
export type Locale = typeof locales[number];
export type Localized = Record<Locale, string>;
export const categories = ['kitchen', 'living', 'bedroom', 'bath', 'storage', 'decor', 'cleaning', 'care', 'accessories'] as const;
export type Category = typeof categories[number];
export type Product = { id: string; slug: string; name: Localized; description: Localized; category: Category; price: number; compareAt: number; images: string[]; badge: 'new' | 'bestseller' | ''; featured: boolean; active: boolean; material: string; dimensions: string; meeshoUrl: string; sourceNote: string; };
