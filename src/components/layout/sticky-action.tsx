import type { ReactNode } from "react";

export function StickyAction({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`sticky bottom-[4.75rem] z-20 mt-auto bg-transparent px-5 pt-3 pb-3 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
