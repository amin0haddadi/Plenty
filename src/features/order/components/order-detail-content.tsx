'use client';

import Image from 'next/image';

import { ScreenHeader } from '@/components/layout/screen-header';
import { ButtonLink } from '@/components/ui/button';
import { orderStatusLabel } from '@/data/order-status';
import { formatNumber, formatToman, toPersianDigits } from '@/lib/format';
import { useShop } from '@/lib/local-shop';

export function OrderDetailContent({ orderId }: { orderId: string }) {
  const shop = useShop();
  const order = shop.orders.find(item => item.id === orderId);

  if (!order) {
    return (
      <div>
        <ScreenHeader title='جزئیات سفارش' />
        <p className='px-5 text-sm text-muted'>سفارش پیدا نشد.</p>
      </div>
    );
  }

  const showCourier =
    order.status === 'shipping' || order.status === 'delivered';

  return (
    <div className='space-y-3 px-4 pb-6'>
      <ScreenHeader title='جزئیات سفارش' />
      <section className='rounded-2xl bg-white p-4'>
        <span className='rounded-lg bg-chip px-2 py-1 text-xs'>
          {orderStatusLabel[order.status]}
        </span>
        <p className='mt-3 font-bold'>سفارش {order.id}</p>
        <p className='text-sm text-muted'>{order.eta}</p>
      </section>
      <section className='rounded-2xl bg-white p-4'>
        <p className='text-xs text-muted'>تحویل تخمینی</p>
        <p className='font-bold'>{order.eta}</p>
      </section>
      <section className='rounded-2xl bg-white p-4'>
        <p className='mb-3 text-sm font-bold'>
          اقلام سفارش · {toPersianDigits(order.items.length)} قلم
        </p>
        {order.items.map(item => (
          <div key={item.productId} className='mb-3 flex items-center gap-3'>
            <Image
              src={item.image}
              alt=''
              width={48}
              height={48}
              className='size-12 rounded-xl object-cover'
            />
            <div className='flex-1'>
              <p className='font-semibold'>{item.name}</p>
              <p className='text-xs text-muted'>
                {toPersianDigits(item.qty)} {item.unit}
              </p>
            </div>
            <span className='text-sm text-muted'>
              {formatNumber(item.price * item.qty)}
            </span>
          </div>
        ))}
        <div className='h-px bg-line' />
        <div className='mt-3 flex justify-between text-sm'>
          <span>{formatToman(order.total)}</span>
          <span>مبلغ پرداخت‌شده</span>
        </div>
      </section>
      <section className='rounded-2xl bg-white p-4'>
        <p className='text-xs text-muted'>آدرس تحویل</p>
        <p className='font-bold'>{order.addressTitle}</p>
        <p className='text-sm text-muted'>{order.addressLine}</p>
        <p className='mt-2 text-sm'>{order.phone}</p>
      </section>
      {showCourier ? (
        <section className='rounded-2xl bg-white p-4'>
          <p className='text-xs text-muted'>پیک سفارش</p>
          <p className='font-bold'>{order.courierName ?? 'علی رضایی'}</p>
        </section>
      ) : null}
      {order.status === 'delivered' ? (
        <ButtonLink href='/categories' variant='block'>
          سفارش مجدد
        </ButtonLink>
      ) : null}
    </div>
  );
}
