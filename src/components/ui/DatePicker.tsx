'use client';

import dayjs from 'dayjs';
import CalendarIcon from 'icons/calendar.svg';
import { TextFieldProps } from '@mui/material';
import { DateRangePicker as DateRangePickerLib } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker as DatePickerLib } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import '../../../public/datePicker.css';
import { Input } from './Input';

type DatePickerRangeProps = {
  start: string;
  end: string;
  onChange?: () => void;
};

type DatePickerProps = {
  label: string;
  onChange: (date: dayjs.Dayjs | null) => void;
  disablePast?: boolean;
  value?: dayjs.Dayjs | null;
  minDate?: dayjs.Dayjs;
  error?: boolean;
  helperText?: string;
};

// TODO: hide error and check on host is it renders immediately

const CustomInput = ({
  label,
  value,
  onChange,
  onBlur,
  onClick,
  onFocus,
  onKeyDown,
  onMouseUp,
  onPaste,
  id,
  //@ts-ignore
  InputProps: { ref },
}: TextFieldProps) => {
  return (
    <Input
      className="border-none"
      onClick={onClick}
      placeholder={label as string}
      value={value as string}
      onChange={onChange}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      ref={ref}
      onMouseUp={onMouseUp}
      onPaste={onPaste}
      onBlur={onBlur}
      autoComplete="off"
      endAdornment={id === ':r0:-start' ? <CalendarIcon /> : undefined}
      _size="xxl"
      id={id}
    />
  );
};

const removeLicenseNotification = () => {
  setTimeout(() => {
    const container = document.querySelector('.MuiDateRangeCalendar-root');

    if (container?.firstChild?.textContent !== 'MUI X Missing license key') return;

    container.removeChild(container?.firstChild);
  }, 0);
};

const DatePickerRangeMUI = ({ start, end }: DatePickerRangeProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <DateRangePickerLib
        localeText={{ start, end }}
        slotProps={{ fieldSeparator: { children: '' } }}
        onOpen={removeLicenseNotification}
      />
    </LocalizationProvider>
  );
};

const DatePickerMUI = ({
  label,
  value,
  onChange,
  disablePast = true,
  minDate = dayjs(),
  error,
  helperText,
}: DatePickerProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <DatePickerLib<dayjs.Dayjs>
        value={value}
        minDate={minDate}
        disablePast={disablePast}
        className="w-full"
        slotProps={{ textField: { variant: 'outlined', size: 'small', error, helperText } }}
        label={label}
        onChange={onChange}
        onOpen={removeLicenseNotification}
      />
    </LocalizationProvider>
  );
};

const DatePicker = ({ value, minDate = dayjs(), label, onChange }: DatePickerProps) => {
  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
    <DatePickerLib<dayjs.Dayjs>
      value={value}
      minDate={minDate}
      label={label}
      onChange={onChange}
      onOpen={removeLicenseNotification}
    />
  </LocalizationProvider>;
};

const DatePickerRange = ({ start, end }: DatePickerRangeProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <DateRangePickerLib
        localeText={{ start, end }}
        slots={{ textField: CustomInput }}
        sx={{
          flexDirection: 'column',
        }}
        slotProps={{
          fieldSeparator: { children: '' },
          field: { className: 'grid grid-col-1 md:flex [&>*:last-child]:ml-0' },
        }}
        onOpen={removeLicenseNotification}
      />
    </LocalizationProvider>
  );
};

export { DatePicker, DatePickerMUI, DatePickerRangeMUI, DatePickerRange };
