import ru from 'date-fns/locale/ru';
import dayjs, { Dayjs } from 'dayjs';
import CalendarIcon from 'icons/calendar.svg';
import { useState } from 'react';
import DatePicker, { ReactDatePickerCustomHeaderProps, ReactDatePickerProps, registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { twMerge } from 'tailwind-merge';
import { getCurrentYear, getSelectOptions } from 'core/helpers/date';
import '../../../public/datePicker.css';
import Select from './Select';

type Props = {
  onChange: (value: Dayjs) => void;
  iconTheme?: 'black' | 'white';
} & Omit<ReactDatePickerProps, 'onChange'>;

registerLocale('ru', ru);

const CustomHeader = ({ changeMonth, changeYear, date }: ReactDatePickerCustomHeaderProps) => {
  const monthsOptions = getSelectOptions({ locale: 'ru', type: 'month', date: dayjs() });
  const currentMonth = dayjs(date).get('M') + 1;
  const yearOptions = getSelectOptions({ type: 'year', yearStart: 0, yearEnd: 10, date: dayjs() });
  const currentYear = getCurrentYear();

  return (
    <div className="flex gap-2 justify-center">
      <Select
        options={monthsOptions}
        value={currentMonth}
        showIcon={false}
        className="border-0 text-primary p-0 capitalize font-medium text-base hover:text-secondary"
        onChange={(value) => changeMonth(value - 1)}
      />
      <Select
        options={yearOptions}
        value={currentYear}
        showIcon={false}
        className="border-0 text-primary p-0 font-medium text-base hover:text-secondary"
        onChange={changeYear}
      />
    </div>
  );
};

const NewDatePicker = ({ onChange, selected, iconTheme = 'white', ...rest }: Props) => {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <div className="relative h-full w-full font-semibold">
      <DatePicker
        locale="ru"
        dateFormat="dd-MM-yyyy"
        onChange={(value) => {
          onChange(dayjs(value));
          setDate(value);
        }}
        className="h-full w-full overflow-hidden rounded-[10px] pl-3 pr-[29px] min-h-[50px]"
        selected={date}
        renderCustomHeader={CustomHeader}
        {...rest}
      />
      <div
        className={twMerge(
          'absolute top-1/2 -translate-y-1/2 right-[2px] flex justify-center items-center w-[30px] h-[calc(100%-4px)] rounded-r-[10px]',
          iconTheme === 'black' ? 'bg-transparent' : 'bg-black'
        )}
      >
        <CalendarIcon className={twMerge(iconTheme === 'black' ? 'fill-black' : 'fill-white')} />
      </div>
    </div>
  );
};

export default NewDatePicker;
