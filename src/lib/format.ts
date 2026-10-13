const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

function toPersianDigits(value: string | number) {
  return String(value).replace(
    /\d/g,
    digit => PERSIAN_DIGITS[Number(digit)] ?? digit,
  );
}

function formatToman(amount: number) {
  return `${toPersianDigits(amount.toLocaleString('en-US'))} تومان`;
}

function formatNumber(amount: number) {
  return toPersianDigits(amount.toLocaleString('en-US'));
}

export { formatNumber, formatToman, toPersianDigits };
