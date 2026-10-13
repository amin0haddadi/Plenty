import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { CheckoutContent } from '@/features/checkout/components/checkout-content';
import { SESSION_COOKIE, decodeSession } from '@/lib/session';

export const metadata: Metadata = { title: 'تکمیل سفارش | پلنتی' };

export default async function CheckoutPage() {
  const jar = await cookies();
  const user = decodeSession(jar.get(SESSION_COOKIE)?.value);
  if (!user) redirect('/welcome');
  return <CheckoutContent phone={user.phone} />;
}
