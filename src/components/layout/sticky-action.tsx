import type { ReactNode } from 'react';

export function StickyAction({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`sticky bottom-19 z-20 mt-auto bg-transparent px-5 py-3 ${className ?? ''}`}
    >
      {children}
    </div>
  );
}
