import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import axios from 'core/axios';
import { calculateDiscount } from 'core/helpers/number';
import { ObjectBusyness } from 'core/types/Booking';
import { EntryWithFuturePricesWithGroup } from 'core/types/Prisma';
import DatePicker from 'ui/DatePicker';
import Select from 'ui/Select';
import { useBookingState } from './StateProvider';

type Props = {
  entry: EntryWithFuturePricesWithGroup;
  className?: string;
  error?: string;
};
type HouseCalendarProps = {
  renderDayContents: (day: number, date: Date | undefined) => JSX.Element;
  entry: EntryWithFuturePricesWithGroup;
  className?: string;
  error?: string;
};

const BathCalendar = ({ renderDayContents, entry, className, error }: HouseCalendarProps) => {
  const { bookingState, setBookingState } = useBookingState();

  return (
    <div className="flex items-center gap-5">
      <DatePicker
        className={className}
        selectsRange={false}
        selected={bookingState.start}
        minDate={new Date()}
        placeholderText="Дата посещения"
        renderDayContents={renderDayContents}
        onChange={(value) => setBookingState((prev) => ({ ...prev, start: value }))}
        error={error}
      />
      <Select
        options={['10:00', '11:00', '12:00'].map((value) => ({ value, label: value }))}
        value={'10:00'}
        onChange={() => {}}
      />
    </div>
  );
};

const DailyCalendar = ({ renderDayContents, entry, className, error }: HouseCalendarProps) => {
  const { bookingState, setBookingState } = useBookingState();

  return (
    <DatePicker
      className={className}
      selectsRange={false}
      selected={bookingState.start}
      minDate={new Date()}
      placeholderText="Дата заезда"
      renderDayContents={renderDayContents}
      onChange={(value) => setBookingState((prev) => ({ ...prev, start: value }))}
      error={error}
    />
  );
};

const HouseCalendar = ({ renderDayContents, entry, className, error }: HouseCalendarProps) => {
  const { bookingState, setBookingState } = useBookingState();
  const [chosenMonth, setChosenMonth] = useState<Dayjs>(dayjs());
  const { data: bookingLimitations } = useSWR(
    '/objects/booking-limitations',
    async (url) => {
      const res = await axios.get<{ start: string; end: string; minDays: number }[]>(url, { params: { id: entry.id } });
      return res.data;
    },
    {
      revalidateOnFocus: false,
    }
  );
  const { data: discountByDays } = useSWR(
    '/objects/discounts-by-days',
    async (url) => {
      const res = await axios.get<{ start: string; end: string; daysCount: number; discount: number }[]>(url, {
        params: { id: entry.id },
      });
      return res.data;
    },
    {
      revalidateOnFocus: false,
    }
  );

  const {
    data: updatedObjectBusyness,
    setSize,
    size,
    isLoading,
    isValidating,
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

            if (!bookings[0]?.isStartingDate) {
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

  const updateTotalByDate = (startDate: Dayjs | null, nightsAmount: number) => {
    let totalPrice = 0;
    let daysDiscount: number | null = null;

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

    if (discountByDays && startDate) {
      const bookingEndDate = startDate.add(nightsAmount, 'D');
      const discountByDay = discountByDays.find(
        (discount) =>
          startDate.isSameOrAfter(dayjs(discount.start)) && bookingEndDate.isSameOrBefore(dayjs(discount.end))
      );

      if (discountByDay && nightsAmount >= discountByDay?.daysCount) {
        totalPrice = calculateDiscount({ price: totalPrice, type: 'Percent', discount: discountByDay.discount });
        daysDiscount = discountByDay.discount;
        console.log(totalPrice);
      }
    }

    console.log(totalPrice);

    setBookingState((prev) => ({
      ...prev,
      total: prev.commoditiesOrderTotal + totalPrice + prev.extraSeats * 1000 * nightsAmount,
      discountByDays: daysDiscount,
      startDate,
      nightsAmount,
    }));
  };

  // Закрыть даты при открытии календаря в которых есть бронирование
  let flattenUpdatedObjectBusyness = updatedObjectBusyness?.flat();
  let startDay = Number(dayjs(bookingState.start).format('D'));
  const monthDifference = dayjs(bookingState.start).diff(dayjs().startOf('M'), 'M');

  // Если выбрали дату не из текущего месяца - берем только нужные данные
  let monthDaysSum = 0;
  for (let i = 0; i < monthDifference; i++) {
    const daysInMonth = dayjs().month(i).daysInMonth();
    monthDaysSum += daysInMonth;
  }
  if (monthDaysSum) {
    flattenUpdatedObjectBusyness = flattenUpdatedObjectBusyness?.slice(
      monthDaysSum,
      flattenUpdatedObjectBusyness.length
    );
  }

  const closedDates = flattenUpdatedObjectBusyness?.reduce((acc, date) => {
    if (!date.availableUnits.length) {
      const excludedDate = dayjs(date.date);
      acc.push(excludedDate.startOf('d').toDate());

      if (excludedDate.get('D') !== 1) {
        acc.push(excludedDate.add(-1, 'D').startOf('D').toDate());
      }
    }

    return acc;
  }, [] as Date[]);
  let maxBookingDay: { unitId?: string; days?: number } = {};

  const findMaxAvailableDays = (flattenUpdatedObjectBusyness: any[], startDay: number) => {
    const startDayAvailableUnits = flattenUpdatedObjectBusyness[startDay - 1].availableUnits;

    const unitsMaxAvailableDays = {} as Record<string, number>;
    for (let i = 0; i < (startDayAvailableUnits?.length ?? 0); i++) {
      const unit = startDayAvailableUnits[i];
      unitsMaxAvailableDays[unit] = startDay;

      for (let j = startDay; j < (flattenUpdatedObjectBusyness.length ?? 0); j++) {
        const nextDayAvailableUnits = flattenUpdatedObjectBusyness[j].availableUnits;

        if (nextDayAvailableUnits.includes(unit)) {
          unitsMaxAvailableDays[unit] += 1;
        } else {
          break;
        }
      }
    }

    return unitsMaxAvailableDays;
  };

  // При выборе даты заезда смотреть насколько далеко можно выбрать дату выезда
  if (flattenUpdatedObjectBusyness?.length && startDay) {
    let closestClosedDate = closedDates?.find((date) => dayjs(bookingState.start).isSameOrBefore(dayjs(date)));
    const unitsMaxAvailableDays = findMaxAvailableDays(flattenUpdatedObjectBusyness, startDay);

    const maxDays = Math.max(...Object.values(unitsMaxAvailableDays));
    const unitWithMaxDays = Object.keys(unitsMaxAvailableDays).find((key) => unitsMaxAvailableDays[key] === maxDays)!;

    maxBookingDay = {
      days: Math.min(
        closestClosedDate ? Number(dayjs(closestClosedDate).format('D')) : Number.MAX_SAFE_INTEGER,
        maxDays
      ),
      unitId: unitWithMaxDays,
    };
  }

  // Убираем даты, у которых возможность бронирования < чем минимальное ограничение бронирования
  if (bookingLimitations && flattenUpdatedObjectBusyness) {
    for (let i = 0; i < bookingLimitations.length; i++) {
      const limitation = bookingLimitations[i];

      const startDayLimitation = dayjs(limitation.start).startOf('d');
      const endDayLimitation = dayjs(limitation.end).startOf('d');
      const difference = endDayLimitation.diff(startDayLimitation, 'd');

      // Проверяем что хотя бы одна из дат совпадает с выбранным месяцем в календаре
      if (
        startDayLimitation.startOf('M').diff(chosenMonth.startOf('M'), 'M') === 0 ||
        endDayLimitation.startOf('M').diff(chosenMonth.startOf('M'), 'M') === 0
      ) {
        for (let j = 0; j <= difference; j++) {
          const startDay = Number(startDayLimitation.add(j, 'd').format('D'));
          const unitsMaxAvailableDays = findMaxAvailableDays(flattenUpdatedObjectBusyness, startDay);

          const maxAvailableDays = Math.max(...Object.values(unitsMaxAvailableDays));

          if (!maxAvailableDays || maxAvailableDays < startDay + limitation.minDays) {
            closedDates?.push(dayjs().set('D', startDay).toDate());
          }
        }
      }
    }
  }

  // Если дата заезда находится в ограничении на бронировании, убрать дата заезда + ограниченные дни
  if (bookingState.start && bookingLimitations) {
    const bookingLimitation = bookingLimitations.find((limitation) => {
      const startDate = dayjs(bookingState.start);
      return startDate.isSameOrAfter(limitation.start) && startDate.isSameOrBefore(limitation.end);
    });

    if (bookingLimitation) {
      for (let i = 1; i <= bookingLimitation.minDays; i++) {
        const newExcludedDate = dayjs(bookingState.start).add(i, 'd').startOf('d').toDate();
        closedDates?.push(newExcludedDate);
      }
    }
  }

  const minDate =
    bookingState.start && !bookingState.end ? dayjs(bookingState.start).add(1, 'day').toDate() : new Date();

  useEffect(() => {
    if (bookingState.start && maxBookingDay.unitId) {
      setBookingState((prev) => ({ ...prev, unitId: maxBookingDay.unitId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingState.start, maxBookingDay.unitId]);

  return (
    <DatePicker
      selectsRange
      className={className}
      placeholderText="Дата заезда"
      startDate={bookingState.start}
      endDate={bookingState.end}
      onChange={([start, end]) => {
        setBookingState((prev) => ({ ...prev, start, end }));
        if (start && end) {
          const nightsAmount = dayjs(end).diff(dayjs(start), 'd');
          updateTotalByDate(dayjs(start), nightsAmount);
        }
      }}
      renderDayContents={renderDayContents}
      minDate={minDate}
      maxDate={maxBookingDay?.days ? chosenMonth.set('D', maxBookingDay.days).toDate() : null}
      selected={bookingState.start ?? new Date()}
      onMonthChange={(month) => {
        const monthDifference = dayjs(month).diff(chosenMonth, 'M');

        setChosenMonth(dayjs(month));
        setSize(size + monthDifference);
      }}
      isLoading={isLoading || isValidating}
      excludeDates={closedDates}
      error={error}
    />
  );
};

const EntryTypeCalendar = ({ entry, className, error }: Props) => {
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

  return entry.group.type === 'House' ? (
    <HouseCalendar renderDayContents={renderDayContents} entry={entry} className={className} error={error} />
  ) : entry.group.type === 'Daily' ? (
    <DailyCalendar renderDayContents={renderDayContents} entry={entry} className={className} error={error} />
  ) : (
    <BathCalendar renderDayContents={renderDayContents} entry={entry} className={className} error={error} />
  );
};

export default EntryTypeCalendar;
