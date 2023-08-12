'use client';

import dayjs from 'dayjs';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ObjectEntry } from '@prisma/client';
import formatToRuble from 'core/helpers/number';
import Button from 'ui/Button';
import Disclosure from 'ui/Disclosure';
import NewDatePicker from 'ui/NewDatePicker';
import NumberInput from 'ui/NumberInput';

type InfoProps = {
  objectEntry: ObjectEntry;
};

type AdditionalGoodsProps = {
  name: string;
  price: number;
  onChange: Dispatch<SetStateAction<number>>;
};

const AdditionalGoods = ({ name, price, onChange }: AdditionalGoodsProps) => {
  const [amount, setAmount] = useState(0);

  const decrease = () => {
    if (!amount) return;
    setAmount((prev) => {
      const newValue = prev - 1;
      onChange((prev) => prev - price);

      return newValue;
    });
  };

  const increase = () => {
    setAmount((prev) => {
      const newValue = prev + 1;
      onChange((prev) => prev + price);

      return newValue;
    });
  };

  return (
    <div className="grid grid-cols-[1fr_80px_100px] py-2">
      <span className="text-tertiary">{name}</span>
      <span className="justify-self-end text-tertiary">{formatToRuble(price)}</span>
      <div className="justify-self-end">
        <span className="p-2 text-tertiary cursor-pointer" onClick={decrease}>
          -
        </span>
        <span className="p-2">{amount}</span>
        <span className="p-2 cursor-pointer" onClick={increase}>
          +
        </span>
      </div>
    </div>
  );
};

const Bill = ({ objectEntry }: InfoProps) => {
  const [total, setTotal] = useState(0);
  const [date, setDate] = useState<dayjs.Dayjs>();
  const [nightsAmount, setNightsAmount] = useState(0);
  const [additionalGoodsTotal, setAdditionalGoodsTotal] = useState(0);

  useEffect(() => {
    let weekdaysPrice = 0;
    let weekendsPrice = 0;

    if (date) {
      let currenDate = date;

      for (let i = 1; i <= nightsAmount; i++) {
        const weekday = currenDate.day();
        const isWeekend = weekday === 0 || weekday === 6;

        if (isWeekend) {
          weekendsPrice += objectEntry.priceWeekends;
        } else {
          weekdaysPrice += objectEntry.priceWeekdays;
        }

        currenDate = date.add(i, 'day');
      }
    }

    setTotal(additionalGoodsTotal + weekdaysPrice + weekendsPrice);
  }, [additionalGoodsTotal, nightsAmount, objectEntry, date]);

  return (
    <section className="[&>*:not(:last-child)]:border-b-2 border-tertiary font-semibold">
      <div className="grid grid-rows-[max-content_max-content] pb-2 grid-cols-[max-content_max-content] gap-2">
        {[objectEntry.priceWeekdays, objectEntry.priceWeekends].map((amount, index) => (
          <span key={amount + index} className="text-3xl font-inter">
            {formatToRuble(amount)}
            {index === 0 && ' /'}
          </span>
        ))}
        {['Пн - Чт', 'Пт - Вс'].map((weekDays, index) => (
          <span className="text-xs text-tertiary" key={weekDays + index}>
            {weekDays}
          </span>
        ))}
      </div>
      <div className="flex flex-col py-5 gap-5">
        <div className="flex gap-4">
          <NewDatePicker placeholderText="Дата заезда" onChange={setDate} minDate={new Date()} />
          <NumberInput placeholder="Кол-во ночей" onChange={setNightsAmount} />
        </div>
        <div className="flex flex-col">
          <span className="text-lg mb-4">Включено в стоимость:</span>
          <span className="text-base">Два парковочных места</span>
          <span className="text-base">Мангал</span>
          <span className="text-base">Электричество</span>
          <span className="text-base">Постельное белье и полотенца (комплект)</span>
        </div>
      </div>
      <div className="py-5">
        <Disclosure
          showIcon={false}
          title={<span className="text-primary">Дополнительные товары</span>}
          description={
            <>
              <AdditionalGoods name="Уголь" price={500} onChange={setAdditionalGoodsTotal} />
              <AdditionalGoods name="Вязанка дров" price={500} onChange={setAdditionalGoodsTotal} />
              <AdditionalGoods name="Веник дубовый" price={500} onChange={setAdditionalGoodsTotal} />
              <AdditionalGoods name="Средство для розжига" price={1000} onChange={setAdditionalGoodsTotal} />
              <AdditionalGoods name="Гигиенический набор" price={500} onChange={setAdditionalGoodsTotal} />
              <AdditionalGoods name="Постельное бельё и полотенца" price={1000} onChange={setAdditionalGoodsTotal} />
            </>
          }
        />
      </div>
      <div className="py-5 flex justify-between text-2xl">
        <span>Итого:</span>
        <span>{formatToRuble(total)}</span>
      </div>
      <Button color="primary" className="ml-auto mt-5">
        Забронировать
      </Button>
    </section>
  );
};

export default Bill;
