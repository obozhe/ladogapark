'use client';

import { useState } from 'react';
import CountUp from 'react-countup';
import { Commodity } from '@prisma/client';
import usePrevious from 'hooks/usePrevious';
import useRouterParams from 'hooks/useRouterParams';
import { formatToRuble } from 'core/helpers/number';
import { EntryWithFuturePricesWithGroupWithServices } from 'core/types/Prisma';
import Button from 'ui/Button';
import NumberInput from 'ui/NumberInput';
import CommodityDisclosure from './CommodityDisclosure';
import EntryTypeCalendar from './EntryTypeCalendar';
import { useBookingState } from './StateProvider';

type InfoProps = {
  entry: EntryWithFuturePricesWithGroupWithServices;
  commonCommodities: Commodity[];
};

const Bill = ({ entry, commonCommodities }: InfoProps) => {
  const { bookingState, updateExtraSeats, updateServicesAmount } = useBookingState();
  const [dateError, setDateError] = useState<string>();

  const prevBillInfoTotal = usePrevious(bookingState.total);
  let prevDiscountByDaysFrom = usePrevious(bookingState.discountByDaysFrom);

  const { setQueryParams } = useRouterParams();

  const commoditiesDisclosure = [...commonCommodities, ...entry.extraCommodities].map((commodity) => ({
    name: commodity.title,
    price: commodity.price,
    max: Number.MAX_SAFE_INTEGER,
    onChange: (amount: 1 | -1) => updateServicesAmount({ amount, id: commodity.id, price: commodity.price }),
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
        <EntryTypeCalendar entry={entry} error={dateError} />
        {Boolean(entry.extraSeats) && (
          <NumberInput
            className="h-fit rounded-[10px] border-2 border-black"
            placeholder={`Дополнительные места (макс. ${entry.extraSeats})`}
            value={bookingState.extraSeats}
            onChange={(amount) => updateExtraSeats(amount, entry.priceExtraSeat)}
            max={entry.extraSeats}
          />
        )}
        <div className="flex flex-col">
          <span className="mb-4 text-lg">Включено в стоимость:</span>
          {entry.includedCommodities.map((includedCommodity) => (
            <span key={includedCommodity.commodityId}>{includedCommodity.commodity.title}</span>
          ))}
        </div>
      </div>
      <div className="py-5">
        <CommodityDisclosure commodities={commoditiesDisclosure} />
      </div>
      <div className="flex justify-between py-5 text-2xl">
        <span>Итого:</span>
        <div className="flex gap-2">
          {bookingState.discountByDaysFrom && (
            <span className="line-through">
              <CountUp
                start={prevDiscountByDaysFrom ?? 0}
                end={bookingState.discountByDaysFrom}
                suffix=" ₽"
                duration={0.5}
              />
            </span>
          )}
          <CountUp start={prevBillInfoTotal ?? 0} end={bookingState.total} suffix=" ₽" duration={0.5} />
        </div>
      </div>
      <Button
        color="primary"
        className="mt-5 w-full lg:ml-auto lg:w-fit"
        onClick={() => {
          if (!bookingState.start || !bookingState.end) {
            setDateError('Обязательное поле');

            return;
          } else {
            setDateError(undefined);
          }

          setQueryParams({ queryName: 'isPayment', value: 'true' });
        }}
      >
        Забронировать
      </Button>
    </section>
  );
};

export default Bill;
