'use client';

import { ButtonLink, TextLink } from '@/components/ui/button';
import { formatToman } from '@/lib/format';
import { useShop } from '@/lib/local-shop';

import { OrderField } from './order-field';
import { OrderHeading } from './order-heading';

export function ConfirmationContent({ orderId }: { orderId: string }) {
  const shop = useShop();
  const order = shop.orders.find(item => item.id === orderId);

  return (
    <div className='flex min-h-[calc(100svh-4.75rem)] flex-col items-center justify-center px-5 py-6 text-center'>
      <div className='w-full'>
        <div className='mx-auto flex size-20 items-center justify-center rounded-full bg-chip text-3xl text-leaf shadow-xl shadow-chip'>
          ✓
        </div>
        <h1 className='mt-5 font-display text-2xl font-bold'>سفارش ثبت شد</h1>
        <p className='mt-2 text-sm text-muted'>
          سفارش شما ثبت شد و برای ارسال آماده است
        </p>
        {order ? (
          <div className='mt-16 rounded-3xl bg-white p-5 text-right'>
            <OrderHeading id={order.id} status={order.status} />
            <div className='my-4 h-px bg-line' />
            <div className='flex items-center justify-between'>
              <OrderField
                className='flex flex-col gap-3'
                label='مبلغ پرداختی'
                value={formatToman(order.total)}
              />
              <OrderField
                className='flex flex-col gap-3'
                label='زمان تقریبی تحویل'
                value={order.eta}
              />
            </div>
            <div className='my-4 h-px bg-line' />
            <OrderField
              className='flex flex-col gap-3'
              label='تحویل به'
              value={order.addressTitle}
            />
          </div>
        ) : null}
        <ButtonLink
          href={order ? `/orders/${order.id}` : '/orders'}
          variant='blockTall'
          className='mt-6'
        >
          مشاهده سفارش
        </ButtonLink>
        <TextLink href='/' className='mt-4 block'>
          بازگشت به خانه
        </TextLink>
      </div>
    </div>
  );
}
