'use client';

import { ButtonLink, TextLink } from '@/components/ui/button';
import { formatToman } from '@/lib/format';
import { useShop } from '@/lib/local-shop';

export function ConfirmationContent({ orderId }: { orderId: string }) {
  const shop = useShop();
  const order = shop.orders.find((item) => item.id === orderId);

  return (
    <div className="px-5 py-10 text-center">
      <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-chip text-3xl text-leaf">✓</div>
      <h1 className="mt-5 font-display text-2xl font-bold">سفارش ثبت شد</h1>
      <p className="mt-2 text-sm text-muted">سفارش شما ثبت شد و برای ارسال آماده است</p>
      {order ? (
        <div className="mt-6 rounded-3xl bg-white p-5 text-right">
          <p className="text-xs text-muted">شماره سفارش</p>
          <p className="font-bold">{order.id}</p>
          <p className="mt-3 text-xs text-muted">مبلغ پرداختی</p>
          <p className="font-bold">{formatToman(order.total)}</p>
          <div className="my-4 h-px bg-line" />
          <p className="text-xs text-muted">تحویل به</p>
          <p className="font-bold">{order.addressTitle}</p>
          <p className="text-sm text-muted">{order.addressLine}</p>
          <p className="mt-3 text-xs text-muted">زمان تقریبی تحویل</p>
          <p className="font-bold">{order.eta}</p>
        </div>
      ) : null}
      <ButtonLink href={order ? `/orders/${order.id}` : '/orders'} variant="blockTall" className="mt-6">
        مشاهده سفارش
      </ButtonLink>
      <TextLink href="/" className="mt-4 block">
        بازگشت به خانه
      </TextLink>
    </div>
  );
}
