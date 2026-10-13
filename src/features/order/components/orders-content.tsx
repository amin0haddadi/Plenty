'use client';

import Link from 'next/link';

import { ScreenHeader } from '@/components/layout/screen-header';
import { ButtonLink } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { orderStatusLabel } from '@/data/order-status';
import { formatToman } from '@/lib/format';
import { useShop } from '@/lib/local-shop';

export function OrdersContent() {
  const shop = useShop();

  return (
    <div>
      <ScreenHeader title='سفارش‌های من' />
      {shop.orders.length === 0 ? (
        <EmptyState
          title='هنوز سفارشی نداری'
          description='اولین سفارش میوه‌ات را ثبت کن'
          action={<ButtonLink href='/categories'>مشاهده میوه‌ها</ButtonLink>}
        />
      ) : (
        <div className='space-y-3 px-4'>
          {shop.orders.map(order => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className='block rounded-2xl bg-white p-4'
            >
              <div className='flex items-center justify-between'>
                <span className='rounded-lg bg-chip px-2 py-1 text-xs'>
                  {orderStatusLabel[order.status]}
                </span>
                <span className='font-semibold'>سفارش {order.id}</span>
              </div>
              <p className='mt-3 text-sm text-muted'>
                {order.items[0]?.name}
                {order.items.length > 1
                  ? ` + ${order.items.length - 1} قلم دیگر`
                  : ''}
              </p>
              <p className='mt-2 font-bold'>{formatToman(order.total)}</p>
              <p className='mt-3 text-sm text-fresh'>مشاهده سفارش</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
