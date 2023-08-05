'use client';

import dayjs from 'dayjs';
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
  onChange: () => void;
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

// TODO: hide error and styling

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

export const DatePicker = ({ value, minDate = dayjs(), label, onChange }: DatePickerProps) => {
  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
    <DatePickerLib<dayjs.Dayjs>
      value={value}
      minDate={minDate}
      className="w-full"
      slots={{ textField: CustomInput }}
      label={label}
      onChange={onChange}
      onOpen={removeLicenseNotification}
    />
  </LocalizationProvider>;
};

export const DatePickerRange = ({ start, end }: DatePickerRangeProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <DateRangePickerLib
        localeText={{ start, end }}
        slots={{ textField: CustomInput }}
        slotProps={{ fieldSeparator: { children: '' } }}
        onOpen={removeLicenseNotification}
      />
    </LocalizationProvider>
  );
};
