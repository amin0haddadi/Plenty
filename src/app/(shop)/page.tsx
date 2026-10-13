import type { Metadata } from 'next';

import { HomeContent } from '@/features/home/components/home-content';

export const metadata: Metadata = {
  title: 'خانه | پلنتی',
};

export default function HomePage() {
  return <HomeContent />;
}
