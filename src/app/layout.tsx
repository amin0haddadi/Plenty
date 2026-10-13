import type { Metadata } from 'next';
import localFont from 'next/font/local';

import { brand } from '@/config/brand';

import './globals.css';

const estedad = localFont({
  src: [
    {
      path: '../../public/fonts/estedad/Estedad-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/estedad/Estedad-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/estedad/Estedad-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/estedad/Estedad-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-estedad',
  display: 'swap',
});

export const metadata: Metadata = {
  title: brand.name,
  description: brand.tagline,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='fa' dir='rtl' className={`${estedad.variable} h-full`}>
      <body
        className='min-h-svh font-sans text-leaf antialiased'
        style={{
          backgroundImage: "url('/bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        {children}
      </body>
    </html>
  );
}
