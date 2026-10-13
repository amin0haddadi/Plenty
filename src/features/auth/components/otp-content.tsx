'use client';

import { useRef } from 'react';

import { useRouter } from 'next/navigation';

import { Controller, useForm } from 'react-hook-form';

import { Button, TextLink } from '@/components/ui/button';

import { AuthForm, authInputClass } from './auth-form';

type OtpFormValues = {
  digits: string[];
};

export function OtpContent() {
  const router = useRouter();
  const {
    control,
    getValues,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormValues>({
    defaultValues: { digits: ['', '', '', ''] },
  });
  const formRef = useRef<HTMLFormElement>(null);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  async function onSubmit(values: OtpFormValues) {
    const response = await fetch('/api/auth/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: values.digits.join('') }),
    });
    if (!response.ok) {
      const body = (await response.json()) as { message?: string };
      setError('root', { message: body.message ?? 'کد نادرست است' });
      return;
    }
    router.push('/');
    router.refresh();
  }

  return (
    <AuthForm
      formRef={formRef}
      onSubmit={handleSubmit(onSubmit)}
      title='کد تأیید'
      description='کد ۱۲۳۴ را وارد کنید تا وارد اپ شوید'
    >
      <div className='mt-6 grid grid-cols-4 gap-3' dir='ltr'>
        {([0, 1, 2, 3] as const).map(index => (
          <Controller
            key={index}
            control={control}
            name={`digits.${index}`}
            rules={{
              required: 'کد ۴ رقمی را وارد کنید',
              pattern: { value: /^\d$/, message: 'کد ۴ رقمی را وارد کنید' },
            }}
            render={({ field }) => (
              <input
                inputMode='numeric'
                ref={node => {
                  field.ref(node);
                  inputs.current[index] = node;
                }}
                value={field.value}
                onBlur={field.onBlur}
                onChange={event => {
                  const next = event.target.value.replace(/\D/g, '').slice(-1);
                  field.onChange(next);
                  if (!next) return;
                  if (index < 3) {
                    inputs.current[index + 1]?.focus();
                    return;
                  }
                  const digits = getValues('digits').map((digit, i) =>
                    i === index ? next : digit,
                  );
                  if (digits.every(digit => /^\d$/.test(digit))) {
                    formRef.current?.requestSubmit();
                  }
                }}
                onKeyDown={event => {
                  if (event.key === 'Backspace' && !field.value && index > 0) {
                    inputs.current[index - 1]?.focus();
                  }
                }}
                className={`h-14 text-center text-lg font-bold ${authInputClass} border-white`}
              />
            )}
          />
        ))}
      </div>
      {errors.digits || errors.root ? (
        <p className='mt-3 text-center text-xs text-danger'>
          {errors.root?.message ?? 'کد ۴ رقمی را وارد کنید'}
        </p>
      ) : null}
      <Button
        type='submit'
        variant='block'
        disabled={isSubmitting}
        className='mt-6'
      >
        {isSubmitting ? 'در حال بررسی…' : 'ورود به اپ'}
      </Button>
      <TextLink href='/login' tone='black' className='mt-4 block text-center'>
        تغییر شماره موبایل
      </TextLink>
    </AuthForm>
  );
}
