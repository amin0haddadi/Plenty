'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ScreenHeader } from '@/components/layout/screen-header';
import { Button } from '@/components/ui/button';
import { orderStatusLabel } from '@/data/order-status';
import { useShop } from '@/lib/local-shop';
import type { SessionUser } from '@/lib/session';

export function AccountContent({ user }: { user: SessionUser }) {
  const shop = useShop();
  const router = useRouter();
  const active = shop.orders.find(
    order => order.status !== 'delivered' && order.status !== 'cancelled',
  );

  async function logout() {
    window.localStorage.removeItem('plenty-shop');
    window.localStorage.removeItem('plenty_token');
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/welcome');
    router.refresh();
  }

  return (
    <div>
      <ScreenHeader title='حساب کاربری' />
      <div className='space-y-3 px-4'>
        <Link
          href='/account'
          className='flex items-center gap-3 rounded-2xl bg-white p-4'
        >
          <span className='flex size-12 items-center justify-center rounded-full bg-chip text-lg'>
            👤
          </span>
          <span className='flex-1'>
            <span className='block font-bold'>{user.name}</span>
            <span className='text-sm text-muted'>{user.phone}</span>
          </span>
        </Link>
        <Link href='/orders' className='block rounded-2xl bg-white p-4'>
          <span className='font-semibold'>سفارش‌های من</span>
          {active ? (
            <span className='mt-1 block text-xs text-fresh'>
              {active.id} · {orderStatusLabel[active.status]}
            </span>
          ) : null}
        </Link>
        <Link
          href='/addresses'
          className='block rounded-2xl bg-white p-4 font-semibold'
        >
          آدرس‌های من
        </Link>
        <div className='overflow-hidden rounded-2xl bg-white'>
          <p className='border-b border-line p-4'>پشتیبانی</p>
          <p className='border-b border-line p-4'>سوالات متداول</p>
          <Button variant='dangerRow' onClick={logout}>
            خروج از حساب
          </Button>
        </div>
      </div>
    </div>
  );
}
