import { Suspense } from 'react';

import type { Metadata } from 'next';

import { ProductsContent } from '@/features/product/components/products-content';

export const metadata: Metadata = { title: 'محصولات | پلنتی' };

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  );
}
