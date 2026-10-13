'use client';

import { useRouter } from 'next/navigation';

import { LuChevronRight } from 'react-icons/lu';

import { Button } from '../ui/button';

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      aria-label='بازگشت'
      variant='circle'
      className='bg-transparent!'
    >
      <LuChevronRight className='size-6' aria-hidden />
    </Button>
  );
}

export function ScreenHeader({ title }: { title: string }) {
  return (
    <header className='flex h-14 items-center px-4'>
      <BackButton />
      <h1 className='flex-1 text-center font-display text-lg font-bold'>
        {title}
      </h1>
      <span className='size-10' />
    </header>
  );
}
