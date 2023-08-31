'use client';

import Link from 'next/link';
import { useState } from 'react';
import formatToRuble from 'core/helpers/number';
import { truthy } from 'core/helpers/typeGuards';
import { GroupWithEntriesWithFuturePrices } from 'core/types/Prisma';
import Button from 'ui/Button';
import Select from 'ui/Select';
import Tabs from 'ui/Tabs';

type Props = {
  group: GroupWithEntriesWithFuturePrices;
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
      <div className="flex items-center gap-2">
        <span className="font-inter text-xl">{price}</span>
        <span className="text-sm text-tertiary">{priceLabel}</span>
      </div>
    </div>
  );
};

const HouseCardPrice = ({ group }: Props) => {
  const [activeObject, setActiveObject] = useState(group.entries[0]);
  const [selectValue, setSelectValue] = useState('');

  const currentFuturePrice = activeObject.futurePrices.find((futurePrice) => futurePrice.id === selectValue);

  const prices = [
    {
      label: 'Понедельник - Четверг',
      price: formatToRuble(currentFuturePrice?.priceWeekday ?? activeObject.priceWeekday),
      priceLabel: 'сутки',
    },
    {
      label: 'Пятница - Воскресенье',
      price: formatToRuble(currentFuturePrice?.priceWeekend ?? activeObject.priceWeekend),
      priceLabel: 'сутки',
    },
    activeObject.extraSeats && { label: 'Дополнительное место:', price: '+1 000 ₽', priceLabel: 'человек' },
  ].filter(truthy);

  return (
    <div className="flex flex-col gap-6 font-semibold">
      <div className="text-4xl">{group.title}</div>
      <div className="flex flex-col gap-4">
        <span className="text-lg text-tertiary">Вместимость объекта:</span>
        <Tabs
          activeTab={activeObject}
          onClick={(value) => setActiveObject(value as (typeof group.entries)[0])}
          tabs={group.entries.map((entry) => ({ label: String(entry.seats), value: entry }))}
        />
      </div>
      <p>{activeObject.description}</p>
      {Boolean(activeObject.futurePrices.length) && (
        <Select
          fullWidth
          size="xxl"
          options={[
            {
              value: '',
              label: `Цены до ${activeObject.futurePrices[0].start.toLocaleDateString('ru', {
                month: 'long',
                day: 'numeric',
              })}`,
            },
            ...activeObject.futurePrices.map((futurePrice) => ({
              value: futurePrice.id,
              label: `Цены после ${futurePrice.start.toLocaleDateString('ru', { month: 'long', day: 'numeric' })}`,
            })),
          ]}
          value={selectValue}
          className="border-none shadow"
          onChange={setSelectValue}
        />
      )}
      <div className="flex flex-col gap-4">
        {prices.map((priceInfo, index) => (
          <PriceInfo {...priceInfo} key={`${priceInfo.label}-${priceInfo.price}-${index}`} />
        ))}
      </div>
      <Link className="mt-auto self-end" href={`/booking/${activeObject.id}`}>
        <Button color="primary">Бронировать</Button>
      </Link>
    </div>
  );
};

export default HouseCardPrice;
