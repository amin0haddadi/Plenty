import { ButtonLink } from '@/components/ui/button';

import { AuthForm } from './auth-form';

export function WelcomeContent() {
  return (
    <AuthForm title="برای استفاده از اپ، ابتدا وارد شوید">
      <ButtonLink href="/login" variant="blockTall" className="mt-8">
        ورود / ثبت‌نام
      </ButtonLink>
      <p className="mt-4 text-center text-xs text-black/70">بدون ورود امکان خرید و سفارش نیست</p>
    </AuthForm>
  );
}
