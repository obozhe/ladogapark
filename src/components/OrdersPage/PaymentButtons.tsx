'use client';

import useRouterParams from 'hooks/useRouterParams';
import RadioButtons from 'ui/RadioButtons';

type Props = {
  paymentType: string;
  discount?: number;
  token?: string;
};

const PaymentButtons = ({ paymentType, discount, token }: Props) => {
  const { setQueryParams } = useRouterParams();

  const paymentTypes = [
    { label: 'Оплатить полностью', id: 'full' },
    Boolean(discount) && { label: `Оплатить ${discount} %`, id: 'half' },
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <RadioButtons
      value={paymentType ?? paymentTypes[0].id}
      onChange={(id) => {
        const args = [{ queryName: 'paymentType', value: id }];
        if (token) {
          args.push({ queryName: 'token', value: token });
        }

        setQueryParams(...args);
      }}
      items={paymentTypes}
    />
  );
};

export default PaymentButtons;
