'use client';

import useRouterParams from 'hooks/useRouterParams';
import RadioButtons from 'ui/RadioButtons';

type Props = {
  paymentType: string;
  discount?: number;
};

const PaymentButtons = ({ paymentType, discount }: Props) => {
  const { setQueryParams } = useRouterParams();

  const paymentTypes = [
    { label: 'Оплатить полностью', id: 'full' },
    { label: `Оплатить ${discount} %`, id: 'half' },
  ];

  return (
    <RadioButtons
      value={paymentType ?? paymentTypes[0].id}
      onChange={(id) => setQueryParams({ queryName: 'paymentType', value: id })}
      items={paymentTypes}
    />
  );
};

export default PaymentButtons;
