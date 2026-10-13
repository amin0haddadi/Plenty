import type { ComponentProps } from 'react';

import Link from 'next/link';

const variants = {
  primary:
    'inline-flex h-12 items-center justify-center rounded-2xl bg-leaf px-6 text-sm font-semibold text-white disabled:opacity-60',
  block:
    'flex h-12 w-full items-center justify-center rounded-2xl bg-leaf px-5 text-sm font-semibold text-white disabled:opacity-60',
  blockTall:
    'flex h-14 w-full items-center justify-center rounded-2xl bg-leaf px-5 text-sm font-semibold text-white disabled:opacity-60',
  split:
    'flex h-14 w-full items-center justify-between rounded-2xl bg-leaf px-5 text-white disabled:bg-[#a8b5ad]',
  outline:
    'flex h-11 w-full items-center justify-center rounded-2xl border border-leaf/30 bg-white text-sm',
  compact: 'h-9 w-full rounded-xl bg-leaf text-xs font-semibold text-white',
  light:
    'inline-flex w-fit items-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-leaf',
  danger: 'text-sm text-danger',
  dangerRow: 'w-full px-4 py-4 text-right text-danger',
  fresh: 'text-sm text-fresh',
  plus: 'flex size-10 items-center justify-center rounded-xl bg-leaf text-white',
  minus: 'flex size-10 items-center justify-center rounded-xl bg-chip',
  trash:
    'flex size-10 items-center justify-center rounded-xl bg-red-100 text-red-500',
  plusSm:
    'flex size-9 items-center justify-center rounded-lg bg-leaf text-white',
  minusSm: 'flex size-9 items-center justify-center rounded-lg bg-chip',
  trashSm:
    'flex size-9 items-center justify-center rounded-lg bg-red-100 text-red-500',
  circle: 'flex size-10 items-center justify-center rounded-full bg-white',
} as const;

type ButtonVariant = keyof typeof variants;

function classes(variant: ButtonVariant, className?: string) {
  return className ? `${variants[variant]} ${className}` : variants[variant];
}

type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant;
};

export function Button({
  variant = 'primary',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={classes(variant, className)} {...props} />
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
};

export function ButtonLink({
  variant = 'primary',
  className,
  ...props
}: ButtonLinkProps) {
  return <Link className={classes(variant, className)} {...props} />;
}

export type { ButtonVariant };

type TextLinkProps = ComponentProps<typeof Link> & {
  tone?: 'fresh' | 'muted' | 'white' | 'black';
};

const textTones = {
  fresh: 'text-sm font-semibold text-fresh',
  muted: 'text-sm text-muted',
  white: 'text-sm font-semibold text-white',
  black: 'text-sm font-semibold text-black',
} as const;

export function TextLink({
  tone = 'fresh',
  className,
  ...props
}: TextLinkProps) {
  const toneClass = textTones[tone];
  return (
    <Link
      className={className ? `${toneClass} ${className}` : toneClass}
      {...props}
    />
  );
}
