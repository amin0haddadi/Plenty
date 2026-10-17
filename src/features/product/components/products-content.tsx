'use client';

import { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { ScreenHeader } from '@/components/layout/screen-header';
import { ProductCard } from '@/components/ui/product-card';
import { ProductCardAction } from '@/components/ui/product-card-action';
import {
  categories as fallbackCategories,
  getCategoriesAsync,
  getProductsAsync,
  products as fallbackProducts,
} from '@/data/products';
import { formatToman } from '@/lib/format';
import type { Product } from '@/types';

export function ProductsContent() {
  const params = useSearchParams();
  const category = params.get('category');

  const [categoriesList, setCategoriesList] = useState(fallbackCategories);
  const [list, setList] = useState<Product[]>(() => {
    if (category === 'picked') {
      return fallbackProducts.filter(product => product.inStock);
    }
    if (category) {
      return fallbackProducts.filter(product => product.category === category);
    }
    return fallbackProducts;
  });

  useEffect(() => {
    getCategoriesAsync().then(cats => setCategoriesList(cats));
  }, []);

  useEffect(() => {
    getProductsAsync(category ?? undefined).then(fetched => {
      setList(fetched);
    });
  }, [category]);

  const title =
    categoriesList.find(item => item.id === category)?.name ?? 'محصولات';

  return (
    <div>
      <ScreenHeader title={title} />
      {list.length === 0 ? (
        <div className='mx-4 rounded-3xl bg-white p-8 text-center'>
          <p className='font-semibold'>محصولی یافت نشد</p>
        </div>
      ) : (
        <div className='grid grid-cols-2 gap-3 px-4 pb-6'>
          {list.map(product => (
            <ProductCard
              key={product.id}
              href={`/products/${product.id}`}
              image={product.image}
              name={product.name}
              meta={`${formatToman(product.price)} / ${product.unit}`}
              available={product.inStock}
            >
              <ProductCardAction
                productId={product.id}
                unit={product.unit}
                inStock={product.inStock}
              />
            </ProductCard>
          ))}
        </div>
      )}
    </div>
  );
}
