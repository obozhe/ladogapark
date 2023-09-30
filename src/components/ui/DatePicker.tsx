import { IconCalendar } from '@tabler/icons-react';
import { IconArrowNarrowLeft, IconArrowNarrowRight } from '@tabler/icons-react';
import ru from 'date-fns/locale/ru';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import DatePickerLib, {
  ReactDatePickerCustomHeaderProps,
  ReactDatePickerProps,
  registerLocale,
} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useOutsideClick from 'hooks/useOutsideClick';
import { getCurrentYear, getSelectOptions } from 'core/helpers/date';
import '../../../public/datePicker.css';
import Select from './Select';

type Props = {
  onChange: (value: Dayjs) => void;
  value?: Date;
} & Omit<ReactDatePickerProps, 'onChange' | 'value'>;

registerLocale('ru', ru);

const CustomHeader = ({ changeMonth, changeYear, date }: ReactDatePickerCustomHeaderProps) => {
  const monthsOptions = getSelectOptions({ locale: 'ru', type: 'month', date: dayjs() });
  const currentMonth = dayjs(date).get('M');
  const yearOptions = getSelectOptions({ type: 'year', yearStart: 0, yearEnd: 10, date: dayjs() });
  const currentYear = dayjs(date).get('year');

  return (
    <div className="flex items-center justify-between">
      <IconArrowNarrowLeft className="cursor-pointer" onClick={() => changeMonth(currentMonth - 1)} />
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
      <IconArrowNarrowRight className="cursor-pointer" onClick={() => changeMonth(currentMonth + 1)} />
    </div>
  );
};

const DatePicker = ({ onChange, selected, value, ...rest }: Props) => {
  const [date, setDate] = useState<Date | null>(value ?? null);
  const { ref, open, setOpen } = useOutsideClick<HTMLDivElement>();

  useEffect(() => {
    setOpen(false);
  }, [date, setOpen]);

  return (
    <div className="relative h-full w-full font-semibold" ref={ref} onClick={() => setOpen(true)}>
      <DatePickerLib
        locale="ru"
        dateFormat="dd.MM.yyyy"
        onChange={(value) => {
          onChange(dayjs(value));
          setDate(value);
        }}
        open={open}
        className="h-full min-h-[50px] w-full overflow-hidden rounded-[10px] pl-3 pr-[29px]"
        selected={date}
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
