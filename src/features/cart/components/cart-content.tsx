'use client';

import Image from 'next/image';

import { LuTrash2 } from 'react-icons/lu';

import { ScreenHeader } from '@/components/layout/screen-header';
import { StickyAction } from '@/components/layout/sticky-action';
import { Button, ButtonLink } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { PriceRow } from '@/components/ui/price-row';
import { QuantityStepper } from '@/components/ui/quantity-stepper';
import { getProduct } from '@/data/products';
import { cartSubtotal, shippingFor } from '@/lib/commerce';
import { formatNumber, formatToman, toPersianDigits } from '@/lib/format';
import { useShop } from '@/lib/local-shop';

export function CartContent() {
  const shop = useShop();
  const lines = shop.cart
    .map(line => ({ ...line, product: getProduct(line.productId) }))
    .filter(line => line.product);
  const subtotal = cartSubtotal(shop.cart);
  const shipping = shippingFor(subtotal);

  if (lines.length === 0) {
    return (
      <div>
        <ScreenHeader title='سبد خرید' />
        <EmptyState
          title='سبد خریدت خالیه'
          description='میوه‌های تازه را اضافه کن'
          action={<ButtonLink href='/categories'>مشاهده میوه‌ها</ButtonLink>}
        />
      </div>
    );
  }

  return (
    <div className='flex min-h-[calc(100svh-4.75rem)] flex-col'>
      <ScreenHeader title='سبد خرید' />
      <p className='px-5 text-xs text-muted'>
        {toPersianDigits(lines.length)} قلم
      </p>
      <div className='space-y-3 px-4 py-3'>
        {lines.map(line => (
          <article
            key={line.productId}
            className='rounded-2xl border border-line bg-white p-3'
          >
            <div className='flex justify-between gap-3'>
              <div className='flex items-center gap-3'>
                <Image
                  src={line.product!.image}
                  alt=''
                  width={72}
                  height={72}
                  className='size-18 rounded-xl object-cover'
                />
                <div className='min-w-0'>
                  <p className='font-semibold'>{line.product!.name}</p>
                  <p className='text-xs text-muted'>
                    {formatNumber(line.product!.price)} / {line.product!.unit}
                  </p>
                </div>
              </div>

              {line.qty > 1 && (
                <div className='flex flex-1 flex-col items-end'>
                  <Button
                    variant='trashSm'
                    aria-label='حذف'
                    onClick={() => shop.setQty(line.productId, 0)}
                  >
                    <LuTrash2 className='size-4' aria-hidden />
                  </Button>
                </div>
              )}
            </div>
            <QuantityStepper
              className='mt-3 h-[42px]'
              qty={line.qty}
              unit={line.product!.unit}
              onIncrease={() => shop.setQty(line.productId, line.qty + 1)}
              onDecrease={() => shop.setQty(line.productId, line.qty - 1)}
            />
          </article>
        ))}
      </div>
      <section className='mx-4 rounded-2xl bg-white p-4'>
        {!shipping.isFree && shipping.remaining > 0 ? (
          <p className='mb-3 rounded-xl bg-orange/15 px-3 py-2 text-center text-xs text-[#b86a1c]'>
            {formatToman(shipping.remaining)} تا ارسال رایگان
          </p>
        ) : shipping.isFree ? (
          <p className='mb-3 rounded-xl bg-chip px-3 py-2 text-center text-xs'>
            ارسال رایگان برای این سفارش
          </p>
        ) : null}
        <PriceRow label='جمع اقلام' value={formatToman(subtotal)} />
        <PriceRow label='هزینه ارسال' value={shipping.label} />
        <div className='my-2 h-px bg-line' />
        <PriceRow label='مبلغ نهایی' value={formatToman(subtotal)} strong />
      </section>
      <StickyAction>
        <ButtonLink href='/checkout' variant='split'>
          <span>ادامه خرید</span>
          <span>{formatToman(subtotal)}</span>
        </ButtonLink>
      </StickyAction>
    </div>
  );
}
