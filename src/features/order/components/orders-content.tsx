'use client';

import Link from 'next/link';

import { ScreenHeader } from '@/components/layout/screen-header';
import { ButtonLink } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { formatToman } from '@/lib/format';
import { useShop } from '@/lib/local-shop';

import { OrderHeading } from './order-heading';

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
              className='flex flex-col gap-3 rounded-2xl bg-white p-4'
            >
              <OrderHeading id={order.id} status={order.status} />
              <p className='text-sm text-muted'>
                {order.items[0]?.name}
                {order.items.length > 1
                  ? ` + ${order.items.length - 1} قلم دیگر`
                  : ''}
              </p>
              <div className='flex items-center justify-between'>
                <p className='font-bold'>{formatToman(order.total)}</p>
                <p className='text-sm text-blue-400'>مشاهده سفارش</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
