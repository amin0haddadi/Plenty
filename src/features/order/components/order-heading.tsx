import type { OrderStatus } from '@/types';

import { OrderStatusBadge } from './order-status-badge';

export function OrderHeading({
  id,
  status,
}: {
  id: string;
  status: OrderStatus;
}) {
  return (
    <div className='flex items-center justify-between'>
      <p className='font-bold'>سفارش {id}</p>
      <OrderStatusBadge status={status} />
    </div>
  );
}
