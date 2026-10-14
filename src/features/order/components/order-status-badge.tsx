import { orderStatusLabel } from '@/data/order-status';
import type { OrderStatus } from '@/types';

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className='rounded-lg bg-chip px-2 py-1 text-xs'>
      {orderStatusLabel[status]}
    </span>
  );
}
