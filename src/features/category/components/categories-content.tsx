import Image from "next/image";
import Link from "next/link";

import { ScreenHeader } from "@/components/layout/screen-header";
import { categories } from "@/data/products";

export function CategoriesContent() {
  return (
    <div>
      <ScreenHeader title="دسته‌ها" />
      <div className="flex flex-col gap-3 px-5 pb-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.id}`}
            className="relative block h-28 overflow-hidden rounded-[20px]"
          >
            <Image
              src={category.image}
              alt=""
              width={700}
              height={224}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute inset-0 bg-[#0f1f18]/48" />
            <span className="absolute inset-0 flex items-center justify-center font-display text-[22px] font-bold text-white">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
