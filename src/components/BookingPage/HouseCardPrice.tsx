'use client';

import { Group } from '@prisma/client';
import Button from 'ui/Button';
import Select from 'ui/Select';
import Tabs from 'ui/Tabs';

type Props = {
  object: Group;
};

type PriceInfoProps = {
  label: string;
  price: string;
  priceLabel: string;
};

const PriceInfo = ({ label, price, priceLabel }: PriceInfoProps) => {
  return (
    <div className="flex justify-between">
      <span className="text-lg">{label}</span>
      <div className="flex gap-2 items-center">
        <span className="font-inter text-xl">{price}</span>
        <span className="text-tertiary text-sm">{priceLabel}</span>
      </div>
    </div>
  );
};

const HouseCardPrice = ({ object }: Props) => {
  console.log(object);
  return (
    <div className="font-semibold flex flex-col gap-6">
      <div className="text-4xl">{object.title}</div>
      <div className="flex flex-col gap-4">
        <span className="text-tertiary text-lg">Вместимость объекта:</span>
        <Tabs
          tabs={[
            { label: '2 чел.', value: '1' },
            { label: '4 чел.', value: '2' },
            { label: '6 чел.', value: '3' },
            { label: '8 чел.', value: '4' },
          ]}
        />
      </div>
      <p>Дом для укромного отдыха на природе в кругу самых близких людей.</p>
      <Select
        options={[{ value: '1', label: 'Цены до 8 октября' }]}
        value="1"
        fullWidth
        className="border-none shadow"
        onChange={() => {}}
      />
      <div className="flex flex-col gap-4">
        {[
          { label: 'Понедельник - Четверг', price: '8 000 ₽', priceLabel: 'сутки' },
          { label: 'Дополнительное место:', price: '+1 000 ₽', priceLabel: 'человек' },
        ].map((priceInfo, index) => (
          <PriceInfo {...priceInfo} key={`${priceInfo.label}-${priceInfo.price}-${index}`} />
        ))}
      </div>
      <div className="self-end mt-auto">
        <Button color="primary">Бронировать</Button>
      </div>
    </div>
  );
};

export default HouseCardPrice;
