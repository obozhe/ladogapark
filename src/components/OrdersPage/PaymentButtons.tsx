'use client';

import useRouterParams from 'hooks/useRouterParams';
import RadioButtons from 'ui/RadioButtons';

const paymentTypes = [
  { label: 'Оплатить картой', id: 'card' },
  { label: 'Оплатить кошельком YooMoney', id: 'yoomoney' },
];

type Props = {
  paymentType: string;
};

const PaymentButtons = ({ paymentType }: Props) => {
  const { setQueryParams } = useRouterParams();

  return (
    <RadioButtons
      value={paymentType ?? paymentTypes[0].id}
      onChange={(id) => setQueryParams({ queryName: 'paymentType', value: id })}
      items={paymentTypes}
    />
  );
};

export default PaymentButtons;
