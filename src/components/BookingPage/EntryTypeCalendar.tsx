import dayjs, { Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import axios from 'core/axios';
import { ObjectBusyness } from 'core/types/Booking';
import { EntryWithFuturePricesWithGroup } from 'core/types/Prisma';
import DatePicker from 'ui/DatePicker';
import Select from 'ui/Select';
import { useBookingState } from './StateProvider';

type Props = {
  entry: EntryWithFuturePricesWithGroup;
};
type HouseCalendarProps = {
  renderDayContents: (day: number, date: Date | undefined) => JSX.Element;
  entry: EntryWithFuturePricesWithGroup;
};

const BathCalendar = ({ renderDayContents, entry }: HouseCalendarProps) => {
  const { bookingState, setBookingState } = useBookingState();

  return (
    <div className="flex items-center gap-5">
      <DatePicker
        selectsRange={false}
        selected={bookingState.start}
        minDate={new Date()}
        placeholderText="Дата посещения"
        renderDayContents={renderDayContents}
        onChange={(value) => setBookingState((prev) => ({ ...prev, start: value }))}
      />
      <Select
        options={['10:00', '11:00', '12:00'].map((value) => ({ value, label: value }))}
        value={'10:00'}
        onChange={() => {}}
      />
    </div>
  );
};

const DailyCalendar = ({ renderDayContents, entry }: HouseCalendarProps) => {
  const { bookingState, setBookingState } = useBookingState();

  return (
    <DatePicker
      selectsRange={false}
      selected={bookingState.start}
      minDate={new Date()}
      placeholderText="Дата заезда"
      renderDayContents={renderDayContents}
      onChange={(value) => setBookingState((prev) => ({ ...prev, start: value }))}
    />
  );
};

const HouseCalendar = ({ renderDayContents, entry }: HouseCalendarProps) => {
  const { bookingState, setBookingState } = useBookingState();
  const [chosenMonth, setChosenMonth] = useState<Dayjs>(dayjs());
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

  // Закрыть даты при открытии календаря в которых есть бронирование
  const flattenUpdatedObjectBusyness = updatedObjectBusyness?.flat();
  const startDay = Number(dayjs(bookingState.start).format('D'));
  const closedDates = flattenUpdatedObjectBusyness?.filter((date) => !date.availableUnits.length);

  let maxBookingDay;

  // При выборе даты заезда смотреть насколько далеко можно выбрать дату выезда
  if (flattenUpdatedObjectBusyness?.length && startDay) {
    const startDayAvailableUnits = flattenUpdatedObjectBusyness[startDay - 1].availableUnits;

    const unitsMaxAvailableDays = {} as Record<string, number>;
    for (let i = 0; i < (startDayAvailableUnits?.length ?? 0); i++) {
      const unit = startDayAvailableUnits[i];
      unitsMaxAvailableDays[unit] = startDay;

      for (let j = startDay; j < (flattenUpdatedObjectBusyness.length ?? 0); j++) {
        const nextDayAvailableUnits = flattenUpdatedObjectBusyness[j].availableUnits;

        if (nextDayAvailableUnits.includes(unit)) {
          unitsMaxAvailableDays[unit] += 1;
        }
      }
    }

    if (bookingState.start) {
      let closestClosedDate = closedDates?.find(({ date }) => dayjs(bookingState.start).isSameOrBefore(dayjs(date)))
        ?.date;

      maxBookingDay = Math.min(
        closestClosedDate ? Number(dayjs(closestClosedDate).format('D')) : Number.MAX_SAFE_INTEGER,
        Math.max(...Object.values(unitsMaxAvailableDays))
      );
    }
  }
  const minDate =
    bookingState.start && !bookingState.end ? dayjs(bookingState.start).add(1, 'day').toDate() : new Date();

  return (
    <DatePicker
      selectsRange
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
      maxDate={maxBookingDay ? chosenMonth.set('D', maxBookingDay).toDate() : null}
      selected={bookingState.start ?? new Date()}
      onMonthChange={(month) => {
        const monthDifference = dayjs(month).diff(chosenMonth, 'M');

        setChosenMonth(dayjs(month));
        setSize(size + monthDifference);
      }}
      isLoading={isLoading || isValidating}
      excludeDates={closedDates?.map(({ date }) => new Date(`${date} 00:00:00`))}
    />
  );
};

const EntryTypeCalendar = ({ entry }: Props) => {
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
    <HouseCalendar renderDayContents={renderDayContents} entry={entry} />
  ) : entry.group.type === 'Daily' ? (
    <DailyCalendar renderDayContents={renderDayContents} entry={entry} />
  ) : (
    <BathCalendar renderDayContents={renderDayContents} entry={entry} />
  );
};

export default EntryTypeCalendar;
