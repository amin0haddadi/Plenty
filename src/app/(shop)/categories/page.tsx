import type { Metadata } from 'next';

import { getCategoriesAsync } from '@/data/products';
import { CategoriesContent } from '@/features/category/components/categories-content';

export const metadata: Metadata = { title: 'دسته‌ها | پلنتی' };

export default async function CategoriesPage() {
  const categories = await getCategoriesAsync();
  return <CategoriesContent categories={categories} />;
}
