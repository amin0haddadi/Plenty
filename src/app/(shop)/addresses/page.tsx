import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { AddressesContent } from '@/features/addresses/components/addresses-content';
import { decodeSession, SESSION_COOKIE } from '@/lib/session';

export const metadata: Metadata = { title: 'آدرس‌ها | پلنتی' };

export default async function AddressesPage() {
  const jar = await cookies();
  const user = decodeSession(jar.get(SESSION_COOKIE)?.value);
  if (!user) redirect('/welcome');
  return <AddressesContent phone={user.phone} />;
}
