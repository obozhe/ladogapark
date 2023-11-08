import { IconCalendar } from '@tabler/icons-react';
import { IconArrowNarrowLeft, IconArrowNarrowRight } from '@tabler/icons-react';
import ru from 'date-fns/locale/ru';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import DatePickerLib, {
  ReactDatePickerCustomHeaderProps,
  ReactDatePickerProps,
  registerLocale,
} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { twMerge } from 'tailwind-merge';
import useOutsideClick from 'hooks/useOutsideClick';
import { getCurrentYear, getSelectOptions } from 'core/helpers/date';
import '../../../public/datePicker.css';
import Select from './Select';

type Props<IsRange extends boolean | undefined> = {
  selectsRange?: boolean;
  isLoading?: boolean;
} & ReactDatePickerProps<never, IsRange>;

type CustomHeaderProps = ReactDatePickerCustomHeaderProps;

registerLocale('ru', ru);

const CustomHeader = ({ changeMonth, changeYear, date }: CustomHeaderProps) => {
  const monthsOptions = getSelectOptions({ locale: 'ru', type: 'month', date: dayjs() });
  const currentMonth = dayjs(date).get('M');
  const yearOptions = getSelectOptions({ type: 'year', yearStart: 0, yearEnd: 10, date: dayjs() });
  const currentYear = dayjs(date).get('year');

  return (
    <div className="flex items-center justify-between">
      <IconArrowNarrowLeft
        className="cursor-pointer"
        onClick={() => {
          const newMonth = currentMonth - 1;

          changeMonth(newMonth);
        }}
      />
      <div className="flex gap-2">
        <Select
          key={currentMonth + 1}
          options={monthsOptions}
          value={currentMonth + 1}
          showIcon={false}
          className="border-0 p-0 text-base font-medium capitalize text-primary hover:text-secondary"
          onChange={(value) => changeMonth(value - 1)}
        />
        <Select
          key={currentYear}
          options={yearOptions}
          value={currentYear}
          showIcon={false}
          className="border-0 p-0 text-base font-medium text-primary hover:text-secondary"
          onChange={changeYear}
        />
      </div>
      <IconArrowNarrowRight
        className="cursor-pointer"
        onClick={() => {
          const newMonth = currentMonth + 1;

          changeMonth(newMonth);
        }}
      />
    </div>
  );
};

const DatePicker = <IsRange extends boolean | undefined>({
  isLoading,
  selectsRange,
  className,
  ...rest
}: Props<IsRange>) => {
  const { ref, open, setOpen } = useOutsideClick<HTMLDivElement>();

  useEffect(() => {
    if ((rest.startDate && rest.endDate) || rest.value) {
      setOpen(false);
    }
  }, [setOpen, rest.startDate, rest.endDate, rest.value]);

  return (
    <div
      className={twMerge('relative h-full w-full rounded-[10px] font-semibold', className)}
      ref={ref}
      onClick={() => setOpen(true)}
    >
      {isLoading}
      <DatePickerLib
        locale="ru"
        dateFormat="dd.MM.yyyy"
        selectsRange={selectsRange}
        // onChange={(value) => {
        //   onChange(value ? dayjs(value) : value);
        //   setDate(value);
        // }}
        open={open}
        className="h-full min-h-[50px] w-full overflow-hidden rounded-[10px] pl-3 pr-[29px] focus:outline-none"
        popperClassName={twMerge(
          isLoading &&
            "relative before:absolute before:w-[calc(100%-10px)] before:left-1/2 before:-translate-x-1/2 before:h-[calc(100%-72px)] before:top-[60px] before:backdrop-blur-sm before:z-10 after:content-['loading'] after:absolute after:z-20 after:left-1/2 after:-translate-x-1/2 after:top-1/2 after:-translate-y-1/2"
        )}
        renderCustomHeader={CustomHeader}
        {...rest}
      />
      <div className="absolute right-[2px] top-1/2 flex h-[calc(100%-4px)] w-[30px] -translate-y-1/2 cursor-pointer items-center justify-center">
        <IconCalendar />
      </div>
    </div>
  );
};

export default DatePicker;
