import type { ReactNode } from 'react';

export function OrderField({
  label,
  value,
  className,
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className='text-xs text-muted'>{label}</p>
      <div className='font-bold'>{value}</div>
    </div>
  );
}
