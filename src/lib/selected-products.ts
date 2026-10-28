import catalog from '../../data/selected-products.json';
import { productSchema } from './validation';
import type { Product } from './types';
/** Portable, supplier-reviewed snapshot. A configured MongoDB remains authoritative. */
export const selectedProducts: Product[] = catalog.products.map((value) => ({
  ...productSchema.parse(value),
  id: `selected-${value.slug}`,
}));
