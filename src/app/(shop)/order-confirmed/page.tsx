import type { Metadata } from 'next';

import { ConfirmationContent } from '@/features/order/components/confirmation-content';

export const metadata: Metadata = { title: 'سفارش ثبت شد | پلنتی' };

export default async function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  return <ConfirmationContent orderId={id ?? ''} />;
}
