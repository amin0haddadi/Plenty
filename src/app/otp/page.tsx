import type { Metadata } from 'next';

import { OtpContent } from '@/features/auth/components/otp-content';

export const metadata: Metadata = {
  title: 'تأیید کد | پلنتی',
};

export default function OtpPage() {
  return <OtpContent />;
}
