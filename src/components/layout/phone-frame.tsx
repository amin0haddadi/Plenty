export function PhoneFrame({
  children,
  footer,
  className,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto flex min-h-svh w-full max-w-[430px] flex-col ${className ?? ''}`}
    >
      <div className='flex-1'>{children}</div>
      {footer}
    </div>
  );
}
