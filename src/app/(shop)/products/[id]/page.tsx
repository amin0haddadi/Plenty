import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getProduct } from '@/data/products';
import { ProductDetailContent } from '@/features/product/components/product-detail-content';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  return { title: product ? `${product.name} | پلنتی` : 'محصول | پلنتی' };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();
  return <ProductDetailContent product={product} />;
}
