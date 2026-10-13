import { LuTrash2 } from "react-icons/lu";

import { toPersianDigits } from "@/lib/format";

import { Button } from "./button";

export function QuantityStepper({
  qty,
  unit,
  onIncrease,
  onDecrease,
  size = "md",
  className,
  removeAtOne = true,
  disabled = false,
}: {
  qty: number;
  unit?: string;
  onIncrease: () => void;
  onDecrease: () => void;
  size?: "sm" | "md";
  className?: string;
  removeAtOne?: boolean;
  disabled?: boolean;
}) {
  const compact = size === "sm";
  const removing = !disabled && removeAtOne && qty <= 1;

  return (
    <div
      className={
        compact
          ? `flex items-center justify-between rounded-xl border border-line  ${className ?? ""}`
          : `flex items-center justify-between rounded-2xl border border-line min-h-10 ${className ?? ""}`
      }
    >
      <Button
        variant={compact ? "plusSm" : "plus"}
        onClick={onIncrease}
        aria-label="افزایش"
        disabled={disabled}
        className="rounded-l-none! h-full! disabled:opacity-40"
      >
        +
      </Button>
      <span className={compact ? "text-xs font-bold text-leaf" : "text-sm"}>
        {disabled && qty <= 0
          ? "—"
          : `${toPersianDigits(qty)}${unit ? ` ${unit}` : ""}`}
      </span>
      <Button
        variant={removing ? "trashSm" : compact ? "minusSm" : "minus"}
        onClick={onDecrease}
        aria-label={removing ? "حذف" : "کاهش"}
        disabled={disabled}
        className="rounded-r-none! h-full! disabled:opacity-40"
      >
        {removing ? (
          <LuTrash2 className={compact ? "size-4" : "size-5"} aria-hidden />
        ) : (
          "−"
        )}
      </Button>
    </div>
  );
}
