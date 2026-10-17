import type { Product } from '@/types';
import { fetchCategoriesFromApi, fetchProductFromApi, fetchProductsFromApi } from '@/lib/api';

const products: Product[] = [
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
  {
    id: 'watermelon',
    name: 'هندوانه',
    unit: 'عدد',
    price: 150_000,
    image: '/products/Watermelon.jpg',
    inStock: true,
    category: 'summer',
    description: 'هندوانه قرمز و شیرین، دست‌چین تازه و خنک.',
  },
];

export const categories = [
  { id: 'fruits', name: 'میوه‌ها', image: '/products/apple.jpg' },
  { id: 'vegetables', name: 'سبزیجات', image: '/products/lettuce.jpg' },
  { id: 'summer', name: 'صیفی‌جات', image: '/products/tomato.jpg' },
  { id: 'citrus', name: 'مرکبات', image: '/products/orange.jpg' },
  { id: 'picked', name: 'دست‌چین امروز', image: '/products/hero.jpg' },
];

export function getProduct(id: string): Product | undefined {
  return products.find(product => product.id === id);
}

export async function getProductAsync(id: string): Promise<Product | undefined> {
  try {
    const apiProduct = await fetchProductFromApi(id);
    if (apiProduct) return apiProduct;
  } catch (err) {
    console.warn(`Failed to fetch product ${id} from API, using fallback:`, err);
  }
  return getProduct(id);
}

export async function getProductsAsync(category?: string): Promise<Product[]> {
  try {
    const apiProducts = await fetchProductsFromApi(category ? { category } : undefined);
    if (apiProducts.length > 0) return apiProducts;
  } catch (err) {
    console.warn('Failed to fetch products from API, using fallback:', err);
  }

  if (category === 'picked') {
    return products.filter(p => p.inStock);
  }
  if (category) {
    return products.filter(p => p.category === category);
  }
  return products;
}

export async function getCategoriesAsync() {
  try {
    const apiCats = await fetchCategoriesFromApi();
    if (apiCats.length > 0) return apiCats;
  } catch (err) {
    console.warn('Failed to fetch categories from API, using fallback:', err);
  }
  return categories;
}

export { products };
