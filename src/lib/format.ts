const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

export function toPersianDigits(value: string | number) {
  return String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)] ?? digit);
}

export function formatToman(amount: number) {
  return `${toPersianDigits(amount.toLocaleString('en-US'))} تومان`;
}

export function formatNumber(amount: number) {
  return toPersianDigits(amount.toLocaleString('en-US'));
}
