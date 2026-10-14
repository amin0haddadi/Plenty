'use client';

import Image from 'next/image';

import { ScreenHeader } from '@/components/layout/screen-header';
import { ButtonLink } from '@/components/ui/button';
import { formatNumber, formatToman, toPersianDigits } from '@/lib/format';
import { useShop } from '@/lib/local-shop';

import { OrderField } from './order-field';
import { OrderHeading } from './order-heading';

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
        <OrderHeading id={order.id} status={order.status} />
      </section>
      <section className='flex items-center justify-between rounded-2xl bg-white p-4'>
        <OrderField label='تحویل تخمینی' value={order.eta} />
        <OrderField label='شماره تماس' value={order.phone} />
      </section>
      <section className='rounded-2xl bg-white p-4'>
        <p className='mb-3 text-sm font-bold'>
          اقلام سفارش : {toPersianDigits(order.items.length)} قلم
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
          <span>مبلغ پرداخت‌شده</span>
          <span>{formatToman(order.total)}</span>
        </div>
      </section>
      <section className='rounded-2xl bg-white p-4'>
        <OrderField label={order.addressTitle} value={order.addressLine} />
      </section>
      {showCourier ? (
        <section className='rounded-2xl bg-white p-4'>
          <OrderField
            label='پیک سفارش'
            value={order.courierName ?? 'علی رضایی'}
          />
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
