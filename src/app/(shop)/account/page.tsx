import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { AccountContent } from '@/features/account/components/account-content';
import { SESSION_COOKIE, decodeSession } from '@/lib/session';

export const metadata: Metadata = { title: 'حساب کاربری | پلنتی' };

export default async function AccountPage() {
  const jar = await cookies();
  const user = decodeSession(jar.get(SESSION_COOKIE)?.value);
  if (!user) redirect('/welcome');
  return <AccountContent user={user} />;
}
