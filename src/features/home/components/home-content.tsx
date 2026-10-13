'use client';

import Image from 'next/image';

import { ButtonLink } from '@/components/ui/button';
import { ProductCard } from '@/components/ui/product-card';
import { ProductCardAction } from '@/components/ui/product-card-action';
import { products } from '@/data/products';
import { formatToman } from '@/lib/format';

export function HomeContent() {
  const featured = products.filter((product) => product.inStock).slice(0, 4);

  return (
    <div>
      <header className="px-5 py-4">
        <span className="font-display text-2xl font-bold">پلنتی</span>
      </header>
      <section className="relative mx-4 overflow-hidden rounded-3xl">
        <Image src="/products/hero.jpg" alt="" width={800} height={480} className="h-52 w-full object-cover" priority />
        <div className="absolute inset-0 bg-linear-to-l from-leaf/70 to-transparent" />
        <div className="absolute inset-y-0 right-0 flex flex-col justify-center px-5 text-white">
          <p className="font-display text-2xl font-bold">تازگی، مستقیم تا خانه</p>
          <ButtonLink href="/categories" variant="light" className="mt-3">
            خرید کنید
          </ButtonLink>
        </div>
      </section>
      <section className="px-4 py-6">
        <h2 className="mb-3 font-display text-lg font-bold">تازه‌های امروز</h2>
        <div className="grid grid-cols-2 gap-3">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              href={`/products/${product.id}`}
              image={product.image}
              name={product.name}
              meta={`${formatToman(product.price)} / ${product.unit}`}
              available
            >
              <ProductCardAction productId={product.id} unit={product.unit} inStock={product.inStock} />
            </ProductCard>
          ))}
        </div>
      </section>
    </div>
  );
}
