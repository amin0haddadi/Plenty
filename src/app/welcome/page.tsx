import type { Metadata } from 'next';

import { WelcomeContent } from '@/features/auth/components/welcome-content';

export const metadata: Metadata = {
  title: 'شروع | پلنتی',
};

export default function WelcomePage() {
  return <WelcomeContent />;
}
