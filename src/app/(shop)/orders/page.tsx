import type { Metadata } from 'next';

import { OrdersContent } from '@/features/order/components/orders-content';

export const metadata: Metadata = { title: 'سفارش‌ها | پلنتی' };

export default function OrdersPage() {
  return <OrdersContent />;
}
