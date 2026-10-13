import type { Metadata } from 'next';

import { PhoneForm } from '@/features/auth/components/phone-form';

export const metadata: Metadata = {
  title: 'ثبت‌نام | پلنتی',
};

export default function RegisterPage() {
  return <PhoneForm mode="register" />;
}
