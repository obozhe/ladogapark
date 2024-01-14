import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { twMerge } from 'tailwind-merge';
import axios from 'core/axios';
import { calculateDiscount } from 'core/helpers/number';
import pluralize from 'core/helpers/pluralize';
import { ObjectBusyness } from 'core/types/Booking';
import { EntryWithFuturePricesWithGroupWithServices } from 'core/types/Prisma';
import DatePicker from 'ui/DatePicker';
import NumberInput from 'ui/NumberInput';
import Select from 'ui/Select';
import { useBookingState } from './StateProvider';

dayjs.locale('ru');

type Props = {
  entry: EntryWithFuturePricesWithGroupWithServices;
  className?: string;
  error?: string;
};
type HouseCalendarProps = {
  renderDayContents: (day: number, date: Date | undefined) => JSX.Element;
  entry: EntryWithFuturePricesWithGroupWithServices;
  className?: string;
  error?: string;
};

const BathCalendar = ({ renderDayContents, entry, className, error }: HouseCalendarProps) => {
  const { bookingState, setBookingState } = useBookingState();
  const [chosenMonth, setChosenMonth] = useState(dayjs());
  const [hours, setHours] = useState(
    (bookingState.end?.getHours() ?? 0) - (bookingState.start?.getHours() ?? 0) > 0
      ? (bookingState.end?.getHours() ?? 0) - (bookingState.start?.getHours() ?? 0)
      : 0
  );

  const updateTotalByDate = (startDate: Dayjs | null, hoursAmount: number) => {
    let totalPrice = 0;

    if (startDate) {
      const weekday = startDate.day();
      const isWeekend = weekday === 0 || weekday === 6;

      const futurePrice = entry.futurePrices.findLast((futurePrice) => {
        const futurePriceDayjs = dayjs(futurePrice.start);
        return startDate.isSameOrAfter(futurePriceDayjs, 'day');
      });

      for (let i = 0; i < hoursAmount; i++) {
        if (futurePrice) {
          totalPrice += isWeekend ? futurePrice.priceWeekend : futurePrice.priceWeekday;
        } else {
          totalPrice += isWeekend ? entry.priceWeekend : entry.priceWeekday;
        }
      }
    }

    setBookingState((prev) => ({
      ...prev,
      total: prev.commoditiesOrderTotal + totalPrice,
    }));
  };

  const { data: updatedObjectBusyness, isLoading } = useSWR(
    [chosenMonth, `/objects-busyness/entry/${entry.id}`],
    async ([chosenMonth, url]) => {
      const date = dayjs().set('M', chosenMonth.get('month')).utcOffset(0);

      const { data: objectBusyness } = await axios.get<ObjectBusyness>(url, {
        params: {
          start: date.startOf('month').toISOString(),
          end: date.endOf('month').toISOString(),
          entryId: entry.id,
        },
      });

      const updatedObjectBusyness = objectBusyness[0][1]?.reduce(
        (acc, busyness) => {
          const value = {
            [busyness[0]]: busyness[1].freeHours.length ? busyness[1].freeHours : null,
          };
          acc.push(value);

          return acc;
        },
        [] as { [key: string]: number[] | null }[]
      );

      return updatedObjectBusyness;
    },
    { revalidateOnFocus: false, revalidateFirstPage: false }
  );

  let selectOptions = [];
  const selectedDateBusyness = updatedObjectBusyness?.find((busyness) => {
    const date = dayjs(Object.keys(busyness)[0]);
    const currentDate = bookingState.start ? dayjs(bookingState.start).startOf('d') : dayjs();

    return date.isSame(currentDate);
  });

  for (let i = entry.group.startHour; i < entry.group.endHour; i++) {
    const availableHours = Object.values(selectedDateBusyness ?? {})[0];
    const isDisabled = !availableHours?.includes(i);

    if (i / 10 < 1) {
      selectOptions.push({ label: `0${i}:00`, value: i, isDisabled });
    } else {
      selectOptions.push({ label: `${i}:00`, value: i, isDisabled });
    }
  }

  const closedDates = updatedObjectBusyness?.filter((busyness) => !Object.values(busyness)[0]);

  let maxHoursNumber = selectOptions.length;
  for (let i = 0; i < selectOptions.length; i++) {
    const startHours = bookingState.start?.getHours();
    const option = selectOptions[i];

    if (startHours) {
      if (option.value > startHours && option.isDisabled) {
        maxHoursNumber = option.value - startHours;

        break;
      }
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <DatePicker
        className={className}
        selectsRange={false}
        selected={bookingState.start}
        minDate={new Date()}
        placeholderText="Дата посещения"
        value={bookingState.start ? dayjs(bookingState.start).format('DD.MM.YYYY') : undefined}
        renderDayContents={renderDayContents}
        onChange={(value) => setBookingState((prev) => ({ ...prev, start: value }))}
        error={!bookingState.start ? error : undefined}
        excludeDates={closedDates?.map((date) => dayjs(Object.keys(date)[0]).toDate())}
        onMonthChange={(month) => {
          const currentMonth = dayjs(month).startOf('month');
          setChosenMonth(currentMonth);
        }}
        isLoading={isLoading}
      />
      <Select
        fullWidth
        label="Время начала"
        error={!bookingState.start?.getHours() ? error : undefined}
        size="xxl"
        value={bookingState.start?.getHours()}
        options={selectOptions}
        onChange={(value: number) => {
          setBookingState((prev) => ({
            ...prev,
            start: dayjs(prev.start).set('hours', value).toDate(),
            end: null,
          }));
          setHours(1);
        }}
      />
      <NumberInput
        placeholder={`Кол-во часов (макс. ${maxHoursNumber})`}
        value={hours}
        max={maxHoursNumber}
        onChange={(value) => {
          setBookingState((prev) => ({
            ...prev,
            end: !value ? null : prev.start ? dayjs(prev.start).add(value, 'hours').toDate() : null,
            unitId: entry.units[0].id,
          }));
          setHours(value);

          updateTotalByDate(dayjs(bookingState.start), value);
        }}
        error={!bookingState.end ? error : undefined}
        className={twMerge('rounded-[10px] border-2 border-black', !bookingState.end && error && 'border-error')}
      />
    </div>
  );
};

const DailyCalendar = ({ renderDayContents, entry, className, error }: HouseCalendarProps) => {
  const [chosenMonth, setChosenMonth] = useState(dayjs());
  const { bookingState, setBookingState } = useBookingState();

  const { data: updatedObjectBusyness, isLoading } = useSWR(
    [chosenMonth, `/objects-busyness/entry/${entry.id}`],
    async ([chosenMonth, url]) => {
      const date = dayjs().set('M', chosenMonth.get('month')).utcOffset(0);

      const { data: objectBusyness } = await axios.get<ObjectBusyness>(url, {
        params: {
          start: date.startOf('month').toISOString(),
          end: date.endOf('month').toISOString(),
          entryId: entry.id,
        },
      });

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

  const updateTotalByDate = (startDate: Dayjs | null) => {
    let totalPrice = 0;

    if (startDate) {
      const weekday = startDate.day();
      const isWeekend = weekday === 0 || weekday === 6;

      const futurePrice = entry.futurePrices.findLast((futurePrice) => {
        const futurePriceDayjs = dayjs(futurePrice.start);
        return startDate.isSameOrAfter(futurePriceDayjs, 'day');
      });

      if (futurePrice) {
        totalPrice += isWeekend ? futurePrice.priceWeekend : futurePrice.priceWeekday;
      } else {
        totalPrice += isWeekend ? entry.priceWeekend : entry.priceWeekday;
      }
    }

    setBookingState((prev) => ({
      ...prev,
      total: prev.commoditiesOrderTotal + totalPrice,
    }));
  };
  const closedDates = updatedObjectBusyness?.filter((objectBusyness) => !objectBusyness.availableUnits.length);

  return (
    <DatePicker
      className={className}
      selectsRange={false}
      selected={bookingState.start}
      minDate={new Date()}
      placeholderText="Дата заезда"
      value={bookingState.start ? dayjs(bookingState.start).format('DD.MM.YYYY') : undefined}
      excludeDates={closedDates?.map(({ date }) => dayjs(date).toDate())}
      onMonthChange={(month) => {
        const currentMonth = dayjs(month).startOf('month');
        setChosenMonth(currentMonth);
      }}
      isLoading={isLoading}
      renderDayContents={renderDayContents}
      onChange={(value) => {
        const startDate = value && dayjs(value).startOf('D').set('hours', entry.group.startHour).toDate();
        const endDate = value && dayjs(value).startOf('D').set('hours', entry.group.endHour).toDate();

        let unitId: undefined | string;
        if (startDate && updatedObjectBusyness) {
          unitId = updatedObjectBusyness?.[startDate?.getDate() - 1].availableUnits[0];
        }

        updateTotalByDate(dayjs(startDate));
        setBookingState((prev) => ({ ...prev, start: startDate, end: endDate, unitId }));
      }}
      error={error}
    />
  );
};

const HouseCalendar = ({ renderDayContents, entry, className, error }: HouseCalendarProps) => {
  let popperHelperText: string[] = [];

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
    let discountByDaysFrom: number | null = null;

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

    if (discountByDays?.length && startDate) {
      const bookingEndDate = startDate.add(nightsAmount, 'D');
      const discountByDay = discountByDays.find(
        (discount) =>
          startDate.isSameOrAfter(dayjs(discount.start)) && bookingEndDate.isSameOrBefore(dayjs(discount.end))
      );

      if (discountByDay && nightsAmount >= discountByDay?.daysCount) {
        discountByDaysFrom = totalPrice;
        totalPrice = calculateDiscount({ price: totalPrice, type: 'Percent', discount: discountByDay.discount });
      }
    }

    setBookingState((prev) => ({
      ...prev,
      total: prev.commoditiesOrderTotal + totalPrice + prev.extraSeats * 1000 * nightsAmount,
      discountByDaysFrom,
      startDate,
      nightsAmount,
    }));
  };

  if (discountByDays?.length && bookingState.start) {
    const discountByStartDay = discountByDays.find((discount) => {
      return (
        dayjs(bookingState.start).startOf('D').isSameOrAfter(dayjs(discount.start).startOf('D')) &&
        dayjs(bookingState.start).startOf('D').isSameOrBefore(dayjs(discount.end).startOf('D'))
      );
    });

    if (discountByStartDay) {
      popperHelperText.push(
        `При заезде ${dayjs(bookingState.start).format('DD MMM')} скидка ${
          discountByStartDay.discount
        }% при бронировании от ${discountByStartDay.daysCount} ${pluralize(
          ['ночь', 'ночей', 'ночей'],
          discountByStartDay.daysCount
        )}`
      );
    }
  }

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
      popperHelperText.push(
        `При заезде ${dayjs(bookingState.start).format('DD MMM')} минимальный срок — ${
          bookingLimitation.minDays
        } ${pluralize(['ночь', 'ночи', 'ночей'], bookingLimitation.minDays)}`
      );
      for (let i = 1; i < bookingLimitation.minDays; i++) {
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
        const startDate = start && dayjs(start).startOf('D').set('hours', entry.group.startHour).toDate();
        const endDate = end && dayjs(end).startOf('D').set('hours', entry.group.endHour).toDate();

        setBookingState((prev) => ({
          ...prev,
          start: startDate,
          end: endDate,
        }));
        if (start && end) {
          const nightsAmount = dayjs(end).diff(dayjs(start), 'd');
          updateTotalByDate(dayjs(start), nightsAmount);
        }
      }}
      renderDayContents={renderDayContents}
      popperHelperText={popperHelperText}
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
