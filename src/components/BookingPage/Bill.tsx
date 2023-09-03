'use client';

import dayjs, { Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';
import CountUp from 'react-countup';
import useLatest from 'hooks/useLatest';
import usePrevious from 'hooks/usePrevious';
import formatToRuble from 'core/helpers/number';
import numberInWords from 'core/helpers/numberInWords';
import pluralize from 'core/helpers/pluralize';
import { EntryWithFuturePricesWithGroupWithServices } from 'core/types/Prisma';
import Button from 'ui/Button';
import DatePicker from 'ui/DatePicker';
import Disclosure from 'ui/Disclosure';
import NumberInput from 'ui/NumberInput';

type InfoProps = {
  entry: EntryWithFuturePricesWithGroupWithServices;
  onSubmit: ({
    total,
    entryId,
    startDate,
    endDate,
  }: {
    total: number;
    entryId: string;
    startDate: string;
    endDate: string;
  }) => Promise<void>;
};

type AdditionalGoodsProps = {
  name: string;
  price: number;
  onChange: (amount: 1 | -1) => void;
  max?: number;
};

const AdditionalGoods = ({ name, price, onChange, max }: AdditionalGoodsProps) => {
  const [amount, setAmount] = useState(0);
  const latestOnChange = useLatest(onChange);

  const decrease = () => {
    if (!amount) return;
    setAmount((prev) => {
      const newValue = prev - 1;

      return newValue;
    });
    latestOnChange.current(-1);
  };

  const increase = () => {
    setAmount((prev) => {
      const newValue = prev + 1;
      if (max && newValue >= max) return prev;

      return newValue;
    });

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

const Bill = ({ entry, onSubmit }: InfoProps) => {
  const [billInfo, setBillInfo] = useState<{
    total: number;
    startDate: Dayjs | null;
    nightsAmount: number;
    extraServices: Record<'title' | 'amount' | 'price', string | number>[];
    extraSeats: number;
    extraServicesTotal: number;
  }>(() => ({
    total: 0,
    startDate: null,
    nightsAmount: 0,
    extraSeats: 0,
    extraServices: entry.extraServices.map((service) => ({ title: service.title, amount: 0, price: service.price })),
    extraServicesTotal: 0,
  }));

  const prevBillInfoTotal = usePrevious(billInfo.total);

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
          {price && <span className="absolute -bottom-[15px] left-1/2 -translate-x-1/2 text-[10px]">{price}</span>}
        </div>
      );
    },
    [entry.futurePrices, entry.priceWeekday, entry.priceWeekend]
  );

  const updateTotalByDate = (startDate: Dayjs | null, nightsAmount: number) => {
    let weekdaysPrice = 0;
    let weekendsPrice = 0;

    if (startDate && nightsAmount) {
      let currenDate = startDate;

      for (let i = 1; i <= nightsAmount; i++) {
        const weekday = currenDate.day();
        const isWeekend = weekday === 0 || weekday === 6;

        if (isWeekend) {
          weekendsPrice += entry.priceWeekend;
        } else {
          weekdaysPrice += entry.priceWeekday;
        }

        currenDate = startDate.add(i, 'day');
      }
    }

    const totalPrice = weekdaysPrice + weekendsPrice;
    setBillInfo((prev) => ({
      ...prev,
      total: prev.extraServicesTotal + totalPrice + prev.extraSeats * 1000 * nightsAmount,
      startDate,
      nightsAmount,
    }));
  };

  const updateServicesAmount = ({ amount, title, price }: { amount: 1 | -1; title: string; price: number }) => {
    setBillInfo((prev) => {
      const extraServiceByTitle = prev.extraServices.find((service) => service.title === title);
      const filteredExtraServices = prev.extraServices.filter((service) => service.title !== title);

      return {
        ...prev,
        total: prev.total + amount * price,
        extraServices: [
          ...filteredExtraServices,
          { title, amount: ((extraServiceByTitle?.amount as number) ?? 0) + amount, price },
        ],
        extraServicesTotal: prev.extraServicesTotal + amount * price,
      };
    });
  };
  const updateExtraSeats = (amount: 1 | -1) => {
    setBillInfo((prev) => ({
      ...prev,
      extraSeats: prev.extraSeats + amount,
      total: prev.total + amount * 1000 * prev.nightsAmount,
    }));
  };

  return (
    <section className="border-tertiary font-semibold [&>*:not(:last-child)]:border-b-2">
      <div className="grid grid-cols-[max-content_max-content] grid-rows-[max-content_max-content] gap-2 pb-2">
        {[entry.priceWeekday, entry.priceWeekend].map((amount, index) => (
          <span key={amount + index} className="font-inter text-3xl">
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
      <div className="flex flex-col gap-5 py-5">
        <div className="flex gap-4">
          <DatePicker
            placeholderText="Дата заезда"
            onChange={(date) => {
              updateTotalByDate(date, billInfo.nightsAmount);
            }}
            minDate={new Date()}
            renderDayContents={renderDayContents}
          />
          <NumberInput
            placeholder="Кол-во ночей"
            onChange={(nightsAmount) => {
              updateTotalByDate(billInfo.startDate, nightsAmount);
            }}
          />
        </div>
        <div className="flex flex-col">
          <span className="mb-4 text-lg">Включено в стоимость:</span>
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
              {entry.extraServices.map((service) => (
                <AdditionalGoods
                  price={service.price}
                  name={service.title}
                  key={service.id}
                  onChange={(amount) => updateServicesAmount({ amount, title: service.title, price: service.price })}
                />
              ))}
              {!Boolean(entry.extraSeats) && (
                <AdditionalGoods
                  name="Дополнительное место"
                  price={1000 ?? entry.priceExtraSeat}
                  onChange={updateExtraSeats}
                  max={entry.extraSeats ?? 2}
                />
              )}
            </>
          }
        />
      </div>
      <div className="flex justify-between py-5 text-2xl">
        <span>Итого:</span>
        <CountUp start={prevBillInfoTotal ?? 0} end={billInfo.total} suffix=" ₽" duration={0.5} />
      </div>
      <Button
        color="primary"
        className="ml-auto mt-5"
        onClick={() => onSubmit({ total: billInfo.total, entryId: entry.id, startDate: '', endDate: '' })}
      >
        Забронировать
      </Button>
    </section>
  );
};

export default Bill;
