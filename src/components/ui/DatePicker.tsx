'use client';

import dayjs from 'dayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker as DatePickerMUI } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import '../../../public/datePicker.css';

type DatePickerRangeProps = {
  start: string;
  end: string;
  onChange: () => void;
};

type DatePickerProps = {
  label: string;
  onChange: (date: dayjs.Dayjs | null) => void;
  disablePast?: boolean;
  value?: dayjs.Dayjs | null;
  minDate?: dayjs.Dayjs;
  error?: string;
};

// TODO: hide error and styling

// const CustomInput = ({
//   label,
//   value,
//   onChange,
//   onBlur,
//   onClick,
//   onFocus,
//   onKeyDown,
//   onMouseUp,
//   onPaste,
//   id,
//   //@ts-ignore
//   InputProps: { ref },
// }: TextFieldProps) => {
//   return (
//     <Input
//       onClick={onClick}
//       placeholder={label as string}
//       value={value as string}
//       onChange={onChange}
//       onFocus={onFocus}
//       onKeyDown={onKeyDown}
//       ref={ref}
//       onMouseUp={onMouseUp}
//       onPaste={onPaste}
//       onBlur={onBlur}
//       autoComplete="off"
//       _size="xxl"
//       id={id}
//     />
//   );
// };

const removeLicenseNotification = () => {
  setTimeout(() => {
    const container = document.querySelector('.MuiDateRangeCalendar-root');

    if (container?.firstChild?.textContent !== 'MUI X Missing license key') return;

    container.removeChild(container?.firstChild);
  }, 0);
};

const DatePickerRange = ({ start, end }: DatePickerRangeProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <DateRangePicker
        localeText={{ start, end }}
        slotProps={{ fieldSeparator: { children: '' }, textField: { margin: 'none' } }}
        onOpen={removeLicenseNotification}
      />
    </LocalizationProvider>
  );
};

const DatePicker = ({ label, value, onChange, disablePast = true, minDate = dayjs(), error }: DatePickerProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <DatePickerMUI<dayjs.Dayjs>
        value={value}
        minDate={minDate}
        disablePast={disablePast}
        className="w-full"
        slotProps={{ textField: { variant: 'outlined', size: 'small', error: !!error, helperText: error } }}
        label={label}
        onChange={onChange}
        onOpen={removeLicenseNotification}
      />
    </LocalizationProvider>
  );
};

export { DatePicker, DatePickerRange };
