export function PriceRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-1 text-sm ${strong ? 'font-bold text-leaf' : ''}`}
    >
      <span className={strong ? '' : 'text-muted'}>{label}</span>
      <span>{value}</span>
    </div>
  );
}
