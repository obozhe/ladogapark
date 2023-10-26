'use client';

import dayjs, { Dayjs } from 'dayjs';
import { useMemo, useRef, useState } from 'react';
import CountUp from 'react-countup';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { Commodity } from '@prisma/client';
import useLatest from 'hooks/useLatest';
import usePrevious from 'hooks/usePrevious';
import useRouterParams from 'hooks/useRouterParams';
import axios from 'core/axios';
import formatToRuble from 'core/helpers/number';
import { ObjectBusyness } from 'core/types/Booking';
import { EntryWithFuturePricesWithGroupWithServices } from 'core/types/Prisma';
import Button from 'ui/Button';
import DatePicker from 'ui/DatePicker';
import Disclosure from 'ui/Disclosure';
import NumberInput from 'ui/NumberInput';
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
  const [chosenMonth, setChosenMonth] = useState(dayjs().get('M'));
  const isBath = entry.group.type === 'Bath';
  const nightsAmount = dayjs(bookingState.start).diff(dayjs(bookingState.end), 'days');

  const {
    data: updatedObjectBusyness,
    setSize,
    size,
  } = useSWRInfinite(
    (index) => {
      const chosenMonth = dayjs().get('M') + index;
      const date = dayjs().set('M', chosenMonth).utcOffset(0);

      const start = date.startOf('month').toISOString();
      const end = date.endOf('month').toISOString();

      return `/objects-busyness/entry/${entry.id}?start=${start}&end=${end}&entryId=${entry.id}`;
    },
    async (url) => {
      const { data: objectBusyness } = await axios.get<ObjectBusyness>(url);

      const updatedObjectBusyness = objectBusyness?.reduce(
        (acc, busyness) => {
          const [unit, stateByDay] = busyness;

          stateByDay.forEach((byDay, index) => {
            const [date, { bookings, isUnitClosed }] = byDay;

            let accItem;
            if (acc[index]) {
              accItem = acc[index];
            } else {
              accItem = { date, availableUnits: [] };
              acc.push(accItem);
            }

            if (isUnitClosed || unit.status === 'Inactive') return;

            // TODO: добавить проверку что бронирование указывает на закрытие
            if (!bookings.length) {
              accItem.availableUnits.push(unit.id);
            }
          });

          return acc;
        },
        [] as { date: string; availableUnits: string[] }[]
      );

      return updatedObjectBusyness;
    },
    { revalidateOnFocus: false, revalidateFirstPage: false }
  );

  const prevBillInfoTotal = usePrevious(bookingState.total);

  const { setQueryParams } = useRouterParams();

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
    let totalPrice = 0;

    if (startDate && nightsAmount) {
      let currenDate = startDate;

      for (let i = 1; i <= nightsAmount; i++) {
        const weekday = currenDate.day();
        const isWeekend = weekday === 0 || weekday === 6;

        const futurePrice = entry.futurePrices.findLast((futurePrice) => {
          const futurePriceDayjs = dayjs(futurePrice.start);
          return currenDate.isSameOrAfter(futurePriceDayjs, 'day');
        });

        if (futurePrice) {
          totalPrice += isWeekend ? futurePrice.priceWeekend : futurePrice.priceWeekday;
        } else {
          totalPrice += isWeekend ? entry.priceWeekend : entry.priceWeekday;
        }

        currenDate = startDate.add(i, 'day');
      }
    }

    setBookingState((prev) => ({
      ...prev,
      total: prev.extraServicesTotal + totalPrice + prev.extraSeats * 1000 * nightsAmount,
      startDate,
      nightsAmount,
    }));
  };

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
  const flattenUpdatedObjectBusyness = updatedObjectBusyness?.flat();
  const closedDates = flattenUpdatedObjectBusyness?.filter((date) => !date.availableUnits.length);

  const startDay = Number(dayjs(bookingState.start).format('D'));
  const startDayAvailableUnits = flattenUpdatedObjectBusyness?.[startDay - 1]?.availableUnits;

  const unitsMaxAvailableDays = {} as Record<string, number>;
  for (let i = 0; i < (startDayAvailableUnits?.length ?? 0); i++) {
    const unit = startDayAvailableUnits?.[i];
    unitsMaxAvailableDays[unit] = startDay;

    for (let j = startDay; j < (flattenUpdatedObjectBusyness?.length ?? 0); j++) {
      const nextDayAvailableUnits = flattenUpdatedObjectBusyness?.[j].availableUnits;

      if (nextDayAvailableUnits?.includes(unit)) {
        unitsMaxAvailableDays[unit] += 1;
      }
    }
  }
  let maxBookingDay;

  if (bookingState.start) {
    let closestClosedDate = closedDates?.find(({ date }) => dayjs(bookingState.start).isSameOrBefore(dayjs(date)))
      ?.date;

    maxBookingDay = Math.min(
      closestClosedDate ? Number(dayjs(closestClosedDate).format('D')) : Number.MAX_SAFE_INTEGER,
      Math.max(...Object.values(unitsMaxAvailableDays))
    );
  }

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
        <div className="flex flex-col gap-4 lg:flex-row">
          <DatePicker
            selectsRange
            placeholderText="Дата заезда"
            startDate={bookingState.start}
            endDate={bookingState.end}
            onChange={([start, end]) => {
              setBookingState((prev) => ({ ...prev, start, end }));
              if (start && end) {
                // updateTotalByDate(date, bookingState.nightsAmount);
              }
            }}
            renderDayContents={renderDayContents}
            minDate={new Date()}
            maxDate={maxBookingDay ? dayjs(bookingState.start).set('D', maxBookingDay).toDate() : null}
            selected={bookingState.start ?? new Date()}
            onMonthChange={() => {
              console.log(size);
              setSize(size + 1);
            }}
            excludeDates={closedDates?.map(({ date }) => new Date(`${date} 00:00:00`))}
          />
          <NumberInput
            placeholder={isBath ? 'Кол-во часов' : 'Кол-во ночей'}
            value={bookingState.nightsAmount}
            onChange={(nightsAmount) => {
              updateTotalByDate(bookingState.startDate, nightsAmount);
            }}
          />
        </div>
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
