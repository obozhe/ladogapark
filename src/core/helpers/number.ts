export const formatToRuble = (price: number, options?: Intl.NumberFormatOptions) => {
  const Ruble = new Intl.NumberFormat('ru', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
    ...options,
  });

  return Ruble.format(price);
};

export const calculateDiscount = ({
  price,
  type,
  discount,
}: {
  price?: number | null;
  type: 'Percent' | 'Amount';
  discount: number;
}) => {
  let result = price ?? 0;
  if (type === 'Amount') {
    result = result ? result - discount : result;
  } else {
    result -= (discount / 100) * result;
  }

  return result;
};
