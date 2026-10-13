'use client';

import { LuPlus } from 'react-icons/lu';

import { useShop } from '@/lib/local-shop';

import { QuantityStepper } from './quantity-stepper';

export function ProductCardAction({
  productId,
  unit,
  inStock,
}: {
  productId: string;
  unit: string;
  inStock: boolean;
}) {
  const shop = useShop();
  const line = shop.cart.find((item) => item.productId === productId);

  if (!inStock) {
    return (
      <p className="mt-2 flex h-[38px] items-center justify-center rounded-xl bg-[#f0ede6] text-[13px] font-semibold text-muted">
        ناموجود
      </p>
    );
  }

  if (line) {
    return (
      <QuantityStepper
        size="sm"
        className="mt-2 h-[38px]"
        qty={line.qty}
        unit={unit}
        onIncrease={() => shop.setQty(productId, line.qty + 1)}
        onDecrease={() => shop.setQty(productId, line.qty - 1)}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => shop.addToCart(productId)}
      className="mt-2 flex h-[38px] w-full items-center justify-center gap-1.5 rounded-xl bg-leaf text-[13px] font-bold text-white"
    >
      <LuPlus className="size-3.5" aria-hidden />
      افزودن
    </button>
  );
}
