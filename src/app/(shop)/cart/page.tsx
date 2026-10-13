import type { Metadata } from 'next';

import { CartContent } from '@/features/cart/components/cart-content';

export const metadata: Metadata = { title: 'سبد خرید | پلنتی' };

export default function CartPage() {
  return <CartContent />;
}
