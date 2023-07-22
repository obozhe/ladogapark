const formatToRuble = (price: number, options?: Intl.NumberFormatOptions) => {
  const Ruble = new Intl.NumberFormat('ru', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
    ...options,
  });

  return Ruble.format(price);
};

export default formatToRuble;
