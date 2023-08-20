import ru from 'date-fns/locale/ru';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import DatePickerLib, {
  ReactDatePickerCustomHeaderProps,
  ReactDatePickerProps,
  registerLocale,
} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'tabler-icons-react';
import useOutsideClick from 'hooks/useOutsideClick';
import { getCurrentYear, getSelectOptions } from 'core/helpers/date';
import '../../../public/datePicker.css';
import Select from './Select';

type Props = {
  onChange: (value: Dayjs) => void;
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

const DatePicker = ({ onChange, selected, ...rest }: Props) => {
  const [date, setDate] = useState<Date | null>(null);
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
        className="h-full w-full overflow-hidden rounded-[10px] pl-3 pr-[29px] min-h-[50px]"
        selected={date}
        renderCustomHeader={CustomHeader}
        {...rest}
      />
      <div className="absolute top-1/2 -translate-y-1/2 right-[2px] flex justify-center items-center w-[30px] h-[calc(100%-4px)] cursor-pointer">
        <Calendar />
      </div>
    </div>
  );
};

export default DatePicker;
