'use client';

import useRouterParams from 'hooks/useRouterParams';
import RadioButtons from 'ui/RadioButtons';

type Props = {
  paymentType: string;
  prePay?: number;
  token?: string;
  isPrePaid: boolean;
};

const PaymentButtons = ({ paymentType, prePay, token, isPrePaid }: Props) => {
  const { setQueryParams } = useRouterParams();

  const paymentTypes = [
    !isPrePaid && { label: 'Оплатить полностью', id: 'full' },
    Boolean(prePay) && !isPrePaid && { label: `Оплатить ${prePay} %`, id: 'half' },
    isPrePaid && { label: 'Оплатить оставшееся', id: 'remain' },
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
