'use client';

import axios from 'axios';
import dayjs from 'dayjs';
import { redirect } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import CountUp from 'react-countup';
import usePrevious from 'hooks/usePrevious';
import formatToRuble from 'core/helpers/number';
import numberInWords from 'core/helpers/numberInWords';
import pluralize from 'core/helpers/pluralize';
import { EntryWithFuturePricesWithGroup } from 'core/types/Prisma';
import Button from 'ui/Button';
import DatePicker from 'ui/DatePicker';
import Disclosure from 'ui/Disclosure';
import NumberInput from 'ui/NumberInput';

type InfoProps = {
  entry: EntryWithFuturePricesWithGroup;
  onSubmit: (amount: number) => Promise<void>;
};

type AdditionalGoodsProps = {
  name: string;
  price: number;
  onChange: Dispatch<SetStateAction<number>>;
  max?: number;
};

const AdditionalGoods = ({ name, price, onChange, max }: AdditionalGoodsProps) => {
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
      if (max && newValue >= max) return prev;

      onChange((prev) => prev + price);

      return newValue;
    });
  };

  return (
    <div className="grid grid-cols-[1fr_80px_100px] py-2">
      <span className="text-tertiary">{name}</span>
      <span className="justify-self-end text-tertiary">{formatToRuble(price)}</span>
      <div className="justify-self-end">
        <button className="px-2 text-tertiary cursor-pointer" onClick={decrease}>
          -
        </button>
        <span className="px-2">{amount}</span>
        <button className="px-2 cursor-pointer" onClick={increase}>
          +
        </button>
      </div>
    </div>
  );
};

const Bill = ({ entry, onSubmit }: InfoProps) => {
  const [total, setTotal] = useState(0);
  const previousTotal = usePrevious(total);
  const [date, setDate] = useState<dayjs.Dayjs>();
  const [nightsAmount, setNightsAmount] = useState(0);
  const [additionalGoodsTotal, setAdditionalGoodsTotal] = useState(0);

  const parking = `${numberInWords(entry.parking)?.[0].toUpperCase()}${numberInWords(entry.parking)?.slice(
    1
  )} ${pluralize(['парковочное', 'парковочных', 'парковочных'], entry.parking)}
  ${pluralize(['место', 'места', 'мест'], entry.parking)}`;

  const renderDayContents = useMemo(
    // eslint-disable-next-line react/display-name
    () => (day: number, date: Date | undefined) => {
      let price;

      const dayjsDate = dayjs(date);
      const currentDate = dayjs();
      const isWeekend = dayjsDate.day() === 0 || dayjsDate.day() === 6;
      const isSameOrAfter = dayjsDate.isSameOrAfter(currentDate, 'day');

      if (isSameOrAfter) {
        const futurePrice = entry.futurePrices.findLast((futurePrice) => {
          const futurePriceDayjs = dayjs(futurePrice.start);
          return dayjsDate.isSameOrAfter(futurePriceDayjs, 'day');
        });

        if (futurePrice) {
          price = isWeekend ? futurePrice.priceWeekend : futurePrice.priceWeekday;
        } else {
          price = isWeekend ? entry.priceWeekend : entry.priceWeekday;
        }
      }

      return (
        <div className="relative mb-2">
          <span className="">{day}</span>
          {price && <span className="absolute text-[10px] left-1/2 -translate-x-1/2 -bottom-[15px]">{price}</span>}
        </div>
      );
    },
    [entry.futurePrices, entry.priceWeekday, entry.priceWeekend]
  );

  useEffect(() => {
    let weekdaysPrice = 0;
    let weekendsPrice = 0;

    if (date) {
      let currenDate = date;

      for (let i = 1; i <= nightsAmount; i++) {
        const weekday = currenDate.day();
        const isWeekend = weekday === 0 || weekday === 6;

        if (isWeekend) {
          weekendsPrice += entry.priceWeekend;
        } else {
          weekdaysPrice += entry.priceWeekday;
        }

        currenDate = date.add(i, 'day');
      }
    }

    setTotal(additionalGoodsTotal + weekdaysPrice + weekendsPrice);
  }, [additionalGoodsTotal, nightsAmount, entry, date]);

  return (
    <section className="[&>*:not(:last-child)]:border-b-2 border-tertiary font-semibold">
      <div className="grid grid-rows-[max-content_max-content] pb-2 grid-cols-[max-content_max-content] gap-2">
        {[entry.priceWeekday, entry.priceWeekend].map((amount, index) => (
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
          <DatePicker
            placeholderText="Дата заезда"
            onChange={setDate}
            minDate={new Date()}
            renderDayContents={renderDayContents}
          />
          <NumberInput placeholder="Кол-во ночей" onChange={setNightsAmount} />
        </div>
        <div className="flex flex-col">
          <span className="text-lg mb-4">Включено в стоимость:</span>
          <span className="text-base">{parking}</span>
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
              {Boolean(entry.extraSeats) && (
                <AdditionalGoods
                  name="Дополнительное место"
                  price={entry.priceExtraSeat}
                  onChange={setAdditionalGoodsTotal}
                  max={entry.extraSeats}
                />
              )}
            </>
          }
        />
      </div>
      <div className="py-5 flex justify-between text-2xl">
        <span>Итого:</span>
        <CountUp start={previousTotal ?? 0} end={total} suffix=" ₽" duration={0.5} />
      </div>
      <Button color="primary" className="ml-auto mt-5" onClick={() => onSubmit(total)}>
        Забронировать
      </Button>
    </section>
  );
};

export default Bill;
