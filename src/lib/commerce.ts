import { FREE_SHIPPING_THRESHOLD } from '@/config/brand';
import { getProduct } from '@/data/products';
import type { CartLine } from '@/types';

export function cartSubtotal(lines: CartLine[]) {
  return lines.reduce((sum, line) => {
    const product = getProduct(line.productId);
    if (!product) return sum;
    return sum + product.price * line.qty;
  }, 0);
}

export function shippingFor(subtotal: number) {
  if (subtotal > FREE_SHIPPING_THRESHOLD) {
    return { label: 'رایگان', isFree: true, remaining: 0 };
  }
  return {
    label: 'طبق قوانین',
    isFree: false,
    remaining: FREE_SHIPPING_THRESHOLD - subtotal,
  };
}
