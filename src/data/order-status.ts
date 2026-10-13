import type { OrderStatus } from '@/types';

export const orderStatusLabel: Record<OrderStatus, string> = {
  waiting_payment: 'در انتظار پرداخت',
  preparing: 'در حال آماده‌سازی',
  waiting_courier: 'در انتظار پیک',
  shipping: 'در حال ارسال',
  delivered: 'تحویل داده شد',
  cancelled: 'لغو شده',
};
