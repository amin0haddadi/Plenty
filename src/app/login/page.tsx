import type { Metadata } from 'next';

import { PhoneForm } from '@/features/auth/components/phone-form';

export const metadata: Metadata = {
  title: 'ورود | پلنتی',
};

export default function LoginPage() {
  return <PhoneForm mode='login' />;
}
