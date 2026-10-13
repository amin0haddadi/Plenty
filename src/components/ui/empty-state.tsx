import type { ReactNode } from 'react';

export function EmptyState({
  title,
  description,
  action,
  className = 'mx-5 mt-16',
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-3xl bg-white p-8 text-center ${className}`}>
      <p className='font-display text-xl font-bold'>{title}</p>
      {description ? (
        <p className='mt-2 text-sm text-muted'>{description}</p>
      ) : null}
      {action ? <div className='mt-6 flex justify-center'>{action}</div> : null}
    </div>
  );
}
