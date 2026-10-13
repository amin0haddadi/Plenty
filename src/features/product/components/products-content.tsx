"use client";

import { useSearchParams } from "next/navigation";

import { ScreenHeader } from "@/components/layout/screen-header";
import { ProductCard } from "@/components/ui/product-card";
import { ProductCardAction } from "@/components/ui/product-card-action";
import { categories, products } from "@/data/products";
import { formatToman } from "@/lib/format";

export function ProductsContent() {
  const params = useSearchParams();
  const category = params.get("category");
  const list =
    category === "picked"
      ? products.filter((product) => product.inStock)
      : category
        ? products.filter((product) => product.category === category)
        : products;
  const title =
    categories.find((item) => item.id === category)?.name ?? "محصولات";

  return (
    <div>
      <ScreenHeader title={title} />
      {list.length === 0 ? (
        <div className="mx-4 rounded-3xl bg-white p-8 text-center">
          <p className="font-semibold">محصولی یافت نشد</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4 pb-6">
          {list.map((product) => (
            <ProductCard
              key={product.id}
              href={`/products/${product.id}`}
              image={product.image}
              name={product.name}
              meta={`${formatToman(product.price)} / ${product.unit}`}
              available={product.inStock}
            >
              <ProductCardAction productId={product.id} unit={product.unit} inStock={product.inStock} />
            </ProductCard>
          ))}
        </div>
      )}
    </div>
  );
}
