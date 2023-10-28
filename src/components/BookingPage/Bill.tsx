'use client';

import dayjs from 'dayjs';
import { useState } from 'react';
import CountUp from 'react-countup';
import { Commodity } from '@prisma/client';
import useLatest from 'hooks/useLatest';
import usePrevious from 'hooks/usePrevious';
import useRouterParams from 'hooks/useRouterParams';
import formatToRuble from 'core/helpers/number';
import { EntryWithFuturePricesWithGroupWithServices } from 'core/types/Prisma';
import Button from 'ui/Button';
import Disclosure from 'ui/Disclosure';
import EntryTypeCalendar from './EntryTypeCalendar';
import { useBookingState } from './StateProvider';

type InfoProps = {
  entry: EntryWithFuturePricesWithGroupWithServices;
  commonCommodities: Commodity[];
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

const Bill = ({ entry, commonCommodities }: InfoProps) => {
  const { bookingState, setBookingState } = useBookingState();
  const nightsAmount = dayjs(bookingState.start).diff(dayjs(bookingState.end), 'days');

  const prevBillInfoTotal = usePrevious(bookingState.total);

  const { setQueryParams } = useRouterParams();

  const updateServicesAmount = ({ amount, price }: { amount: 1 | -1; title: string; price: number }) => {
    setBookingState((prev) => {
      return {
        ...prev,
        total: prev.total + amount * price,
        extraServicesTotal: prev.extraServicesTotal + amount * price,
      };
    });
  };
  const updateExtraSeats = (amount: 1 | -1) => {
    setBookingState((prev) => ({
      ...prev,
      extraSeats: prev.extraSeats + amount,
      total: prev.total + amount * 1000 * nightsAmount,
    }));
  };

  return (
    <section className="mobile-container border-tertiary font-semibold [&>*:not(:last-child)]:border-b-2">
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
        <EntryTypeCalendar entry={entry} />
        <div className="flex flex-col">
          <span className="mb-4 text-lg">Включено в стоимость:</span>
          {entry.includedCommodities.map((includedCommodity) => (
            <span key={includedCommodity.commodityId}>{includedCommodity.commodity.title}</span>
          ))}
        </div>
      </div>
      <div className="py-5">
        <Disclosure
          showIcon={false}
          title={<span className="text-primary">Дополнительные товары</span>}
          description={
            <>
              {[...commonCommodities, ...entry.extraCommodities].map((commodity) => (
                <AdditionalGoods
                  price={commodity.price}
                  name={commodity.title}
                  key={commodity.id}
                  onChange={(amount) =>
                    updateServicesAmount({ amount, title: commodity.title, price: commodity.price })
                  }
                />
              ))}
              {Boolean(entry.extraSeats) && (
                <AdditionalGoods
                  name="Дополнительное место"
                  price={entry.priceExtraSeat}
                  onChange={updateExtraSeats}
                  max={entry.extraSeats}
                />
              )}
            </>
          }
        />
      </div>
      <div className="flex justify-between py-5 text-2xl">
        <span>Итого:</span>
        <CountUp start={prevBillInfoTotal ?? 0} end={bookingState.total} suffix=" ₽" duration={0.5} />
      </div>
      <Button
        color="primary"
        className="mt-5 w-full lg:ml-auto lg:w-fit"
        onClick={() => setQueryParams({ queryName: 'isPayment', value: 'true' })}
      >
        Забронировать
      </Button>
    </section>
  );
};

export default Bill;
