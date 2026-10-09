export const CURRENCY_CODE = process.env.NEXT_PUBLIC_CURRENCY_CODE || 'USD';
export const LOCALE = process.env.NEXT_PUBLIC_LOCALE || 'en-US';

export const formatCurrency = (amount: number | string) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) {
    return new Intl.NumberFormat(LOCALE, {
      style: 'currency',
      currency: CURRENCY_CODE,
      minimumFractionDigits: 2,
    }).format(0);
  }

  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY_CODE,
    minimumFractionDigits: 2,
  }).format(num);
};
