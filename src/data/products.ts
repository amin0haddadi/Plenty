import type { Product } from '@/types';

export const products: Product[] = [
  {
    id: 'nectarine',
    name: 'شلیل',
    unit: 'کیلو',
    price: 105_000,
    image: '/products/apple.jpg',
    inStock: true,
    category: 'fruits',
    description: 'شلیل تازه و آبدار، مناسب میان‌وعده و سالاد میوه.',
  },
  {
    id: 'apple',
    name: 'سیب',
    unit: 'کیلو',
    price: 180_000,
    image: '/products/apple.jpg',
    inStock: true,
    category: 'fruits',
    description: 'سیب دست‌چین، شیرین و مناسب نگهداری چندروزه.',
  },
  {
    id: 'banana',
    name: 'موز',
    unit: 'کیلو',
    price: 120_000,
    image: '/products/orange.jpg',
    inStock: true,
    category: 'fruits',
    description: 'موز رسیده برای صبحانه و اسموتی.',
  },
  {
    id: 'tomato',
    name: 'گوجه',
    unit: 'کیلو',
    price: 95_000,
    image: '/products/tomato.jpg',
    inStock: false,
    category: 'summer',
    description: 'گوجه خوشه‌ای. فعلاً در انبار موجود نیست.',
  },
  {
    id: 'lettuce',
    name: 'کاهو',
    unit: 'عدد',
    price: 45_000,
    image: '/products/lettuce.jpg',
    inStock: true,
    category: 'vegetables',
    description: 'کاهو تازه برای سالاد روزانه.',
  },
  {
    id: 'orange',
    name: 'پرتقال',
    unit: 'کیلو',
    price: 120_000,
    image: '/products/orange.jpg',
    inStock: false,
    category: 'citrus',
    description: 'پرتقال آب‌گیری. فعلاً موجود نیست.',
  },
];

export const categories = [
  { id: 'fruits', name: 'میوه‌ها', image: '/products/apple.jpg' },
  { id: 'vegetables', name: 'سبزیجات', image: '/products/lettuce.jpg' },
  { id: 'summer', name: 'صیفی‌جات', image: '/products/tomato.jpg' },
  { id: 'citrus', name: 'مرکبات', image: '/products/orange.jpg' },
  { id: 'picked', name: 'دست‌چین امروز', image: '/products/hero.jpg' },
];

export function getProduct(id: string) {
  return products.find((product) => product.id === id);
}
