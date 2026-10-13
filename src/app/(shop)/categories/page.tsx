import type { Metadata } from 'next';

import { CategoriesContent } from '@/features/category/components/categories-content';

export const metadata: Metadata = { title: 'دسته‌ها | پلنتی' };

export default function CategoriesPage() {
  return <CategoriesContent />;
}
