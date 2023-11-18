import { useState } from 'react';
import useLatest from 'hooks/useLatest';
import { formatToRuble } from 'core/helpers/number';
import Disclosure from 'ui/Disclosure';

type Props = {
  commodities: {
    price: number;
    name: string;
    onChange: (amount: 1 | -1) => void;
    max: number;
    isActive: boolean;
    value?: number;
  }[];
};

type AdditionalGoodsProps = {
  name: string;
  price: number;
  onChange: (amount: 1 | -1) => void;
  max?: number;
  value?: number;
};

const AdditionalGoods = ({ name, price, onChange, max, value = 0 }: AdditionalGoodsProps) => {
  const [amount, setAmount] = useState(value);
  const latestOnChange = useLatest(onChange);

  const decrease = () => {
    if (!amount) return;
    setAmount((prev) => prev - 1);

    latestOnChange.current(-1);
  };

  const increase = () => {
    if (max && amount >= max) return;
    setAmount((prev) => prev + 1);

    latestOnChange.current(1);
  };

  return (
    <div className="grid grid-cols-[1fr_80px_100px] py-2">
      <span className="text-tertiary">{name}</span>
      <span className="justify-self-end text-tertiary">{formatToRuble(price)}</span>
      <div className="justify-self-end">
        <button className="cursor-pointer px-2 text-tertiary" onClick={decrease}>
          -
        </button>
        <span className="px-2">{amount}</span>
        <button className="cursor-pointer px-2" onClick={increase}>
          +
        </button>
      </div>
    </div>
  );
};

const CommodityDisclosure = ({ commodities }: Props) => {
  return (
    <Disclosure
      showIcon={false}
      title={<span className="font-semibold text-primary">Дополнительные товары</span>}
      description={commodities.map(
        (commodity) =>
          commodity.isActive && (
            <AdditionalGoods
              key={commodity.name}
              price={commodity.price}
              name={commodity.name}
              onChange={commodity.onChange}
              max={commodity.max}
              value={commodity.value}
            />
          )
      )}
    />
  );
};

export default CommodityDisclosure;
