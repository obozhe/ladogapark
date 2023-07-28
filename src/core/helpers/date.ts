import dayjs, { Dayjs, ManipulateType } from 'dayjs';
import { DateFormats } from 'core/enums/DateFormats';
import { getArrayFromRange } from './array';

export const MONTHS_IN_YEAR = 12;

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const formatDate = (date: string | Date | undefined, format: DateFormats) =>
  date ? dayjs(date).format(format) : '';

export const greetingTime = () => {
  const nowHours = Number.parseInt(dayjs().format('HH'));

  const morning = 5;
  const afternoon = 12;
  const evening = 17;
  const night = 21;

  switch (true) {
    case morning <= nowHours && nowHours < afternoon:
      return 'morning';

    case afternoon <= nowHours && nowHours < evening:
      return 'afternoon';

    case evening <= nowHours && nowHours < night:
      return 'evening';

    case night <= nowHours || nowHours < morning:
      return 'night';

    default:
      return '';
  }
};

export const getMonthsArray = () => {
  return getArrayFromRange(MONTHS_IN_YEAR);
};

export const getSelectOptions = (date: Dayjs, type: 'day' | 'month' | 'year') => {
  const getDayOptions = () =>
    getArrayFromRange(date.daysInMonth(), 1).map((dayNumber) => ({
      label: String(dayNumber),
      value: dayNumber,
    }));

  const getMonthOptions = () =>
    getMonthsArray().map((monthNumber: number) => {
      const month = dayjs(`${date.year()}-${monthNumber}`);
      const formattedMonth = month.format('MMMM');

      return {
        label: formattedMonth,
        value: monthNumber,
      };
    });

  const getYearOptions = () =>
    getArrayFromRange(date.year() + 10, date.year() - 10).map((year) => ({
      label: String(year),
      value: year,
    }));

  switch (type) {
    case 'day':
      return getDayOptions();

    case 'month':
      return getMonthOptions();

    case 'year':
      return getYearOptions();
  }
};

export const getCurrentYear = () => new Date().getFullYear();

export const getRangeOfDates = (
  start: dayjs.Dayjs,
  end: dayjs.Dayjs,
  key: ManipulateType,
  arr = [start.startOf(key)]
): dayjs.Dayjs[] => {
  if (start.isAfter(end)) throw new Error('start must precede end');

  const next = dayjs(start).add(1, key).startOf(key);

  if (next.isAfter(end, key)) return arr;

  return getRangeOfDates(next, end, key, arr.concat(next));
};
