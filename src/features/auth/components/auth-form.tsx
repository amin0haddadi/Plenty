import type { FormEvent, ReactNode, Ref } from 'react';

import { PhoneFrame } from '@/components/layout/phone-frame';
import { brand } from '@/config/brand';

const authInputClass =
  'rounded-2xl border bg-white/70 text-black outline-none placeholder:text-black/40';

export function AuthForm({
  title,
  description,
  children,
  onSubmit,
  formRef,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  formRef?: Ref<HTMLFormElement>;
}) {
  return (
    <PhoneFrame>
      <section className='flex min-h-svh flex-col justify-center px-5 py-10'>
        <form
          ref={formRef}
          onSubmit={onSubmit}
          className='rounded-3xl border-2 border-white bg-white/20 p-6 text-black shadow-[0_0_24px_rgba(255,255,255,0.45)] backdrop-blur-sm'
        >
          <div className='mb-6 text-center'>
            <p className='font-display text-3xl font-bold'>{brand.name}</p>
            <p className='mt-2 text-sm text-black/70'>{brand.tagline}</p>
          </div>
          <h1 className='font-display text-2xl font-bold'>{title}</h1>
          {description ? (
            <p className='mt-2 text-sm text-black/70'>{description}</p>
          ) : null}
          {children}
        </form>
      </section>
    </PhoneFrame>
  );
}

export { authInputClass };
