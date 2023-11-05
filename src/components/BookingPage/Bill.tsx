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
import CommodityDisclosure from './CommodityDisclosure';
import EntryTypeCalendar from './EntryTypeCalendar';
import { useBookingState } from './StateProvider';

type InfoProps = {
  entry: EntryWithFuturePricesWithGroupWithServices;
  commonCommodities: Commodity[];
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

  const commoditiesDisclosure = [...commonCommodities, ...entry.extraCommodities].map((commodity) => ({
    name: commodity.title,
    price: commodity.price,
    max: Number.MAX_SAFE_INTEGER,
    onChange: (amount: 1 | -1) => updateServicesAmount({ amount, title: commodity.title, price: commodity.price }),
    isActive: true,
  }));

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
        <CommodityDisclosure
          commodities={[
            ...commoditiesDisclosure,
            {
              price: entry.priceExtraSeat,
              name: 'Дополнительное место',
              onChange: updateExtraSeats,
              isActive: Boolean(entry.extraSeats),
              max: entry.extraSeats,
            },
          ]}
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
