'use client';

import { useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { BackButton } from '@/components/layout/screen-header';
import { StickyAction } from '@/components/layout/sticky-action';
import { Button } from '@/components/ui/button';
import { QuantityStepper } from '@/components/ui/quantity-stepper';
import { formatToman } from '@/lib/format';
import { useShop } from '@/lib/local-shop';
import type { Product } from '@/types';

export function ProductDetailContent({ product }: { product: Product }) {
  const router = useRouter();
  const shop = useShop();
  const [qty, setQty] = useState(1);
  const total = product.price * qty;

  return (
    <div className='flex min-h-[calc(100svh-4.75rem)] flex-col'>
      <div className='relative h-[360px]'>
        <Image
          src={product.image}
          alt=''
          width={800}
          height={720}
          priority
          className={`size-full object-cover ${product.inStock ? '' : 'opacity-55'}`}
        />
        {product.inStock ? null : (
          <div className='absolute inset-0 bg-cream/35' />
        )}
        <div className='absolute inset-s-2 top-2'>
          <BackButton />
        </div>
      </div>

      <section className='relative -mt-7 flex flex-1 flex-col rounded-t-[32px] border-t-2 border-line bg-white px-5 pt-7'>
        <div className='flex items-center justify-between'>
          <p className='font-display text-[28px] leading-none font-bold text-leaf'>
            {product.name}
          </p>
          <p className='mt-2 text-base font-semibold text-muted'>
            {formatToman(product.price)} / {product.unit}
          </p>
        </div>

        <p className='mt-4 text-sm/10 text-muted'>
          {product.description}
        </p>
        <div className='my-4 h-px bg-line' />
        <p
          className={`text-[13px] font-semibold ${product.inStock ? 'text-leaf' : 'text-[#c5cbc3]'}`}
        >
          انتخاب مقدار
        </p>
        <QuantityStepper
          className='mt-3 h-[56px] bg-cream'
          qty={product.inStock ? qty : 0}
          unit={product.inStock ? product.unit : undefined}
          removeAtOne={false}
          disabled={!product.inStock}
          onIncrease={() => setQty(value => value + 1)}
          onDecrease={() => setQty(value => Math.max(1, value - 1))}
        />
        {!product.inStock && (
          <p className='mt-6 text-[13px] text-muted'>
            به‌محض موجود شدن خبرتان می‌کنیم
          </p>
        )}
        <StickyAction className='-mx-5'>
          <Button
            variant='split'
            disabled={!product.inStock}
            onClick={() => {
              shop.addToCart(product.id, qty);
              router.push('/cart');
            }}
          >
            {product.inStock ? (
              <>
                <span>{formatToman(total)}</span>
                <span>افزودن به سبد</span>
              </>
            ) : (
              <span className='w-full text-center'>فعلاً موجود نیست</span>
            )}
          </Button>
        </StickyAction>
      </section>
    </div>
  );
}
