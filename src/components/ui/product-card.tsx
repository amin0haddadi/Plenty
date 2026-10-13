import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

export function ProductCard({
  href,
  image,
  name,
  meta,
  available,
  children,
}: {
  href: string;
  image: string;
  name: string;
  meta?: string;
  available?: boolean;
  children?: ReactNode;
}) {
  return (
    <article className="overflow-hidden rounded-[18px] bg-white shadow-[0_8px_24px_rgba(15,31,24,0.06)]">
      <Link href={href} className="relative block h-[150px]">
        <Image src={image} alt="" width={330} height={300} className="h-full w-full object-cover" />
        {available === undefined ? null : (
          <span
            className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
              available ? 'bg-chip text-leaf' : 'bg-[#f8d7d7] text-[#d14343]'
            }`}
          >
            {available ? 'موجود' : 'ناموجود'}
          </span>
        )}
      </Link>
      <div className="relative -mt-4 rounded-t-[18px] bg-white px-3 pt-2.5 pb-3">
        <Link href={href} className="block">
          <p className="text-[15px] font-bold text-leaf">{name}</p>
          {meta ? <p className="mt-0.5 text-[11px] font-medium text-muted">{meta}</p> : null}
        </Link>
        {children}
      </div>
    </article>
  );
}
