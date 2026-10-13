import type { Metadata } from 'next';

import { OrderDetailContent } from '@/features/order/components/order-detail-content';

export const metadata: Metadata = { title: 'جزئیات سفارش | پلنتی' };

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderDetailContent orderId={id} />;
}
