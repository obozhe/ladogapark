import dayjs from 'dayjs';
import { useLayoutEffect } from 'react';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { DateRange } from '@mui/x-date-pickers-pro/internals/models';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const removeLicenseNotification = () => {
  requestAnimationFrame(() => {
    const container = document.querySelector('.MuiDateRangeCalendar-root');

    if (container?.firstChild?.textContent !== 'MUI X Missing license key') return;

    container.removeChild(container?.firstChild);
  });
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

type DateRangeProps = {
  label: string;
  onChange: (value: DateRange<dayjs.Dayjs>) => void;
  disablePast?: boolean;
  value?: DateRange<dayjs.Dayjs> | DateRange<null>;
  minDate?: dayjs.Dayjs;
  error?: boolean;
  helperText?: string;
  calendars?: 1 | 2 | 3;
  disableDates: { start: string; end: string; position: 'start' | 'end' }[];
};

export const StaticDateRangePickerMUI = ({
  label,
  value,
  onChange,
  minDate = dayjs(),
  calendars = 2,
  disableDates,
}: DateRangeProps) => {
  useLayoutEffect(() => {
    removeLicenseNotification();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <MultiInputDateRangeField
        value={value}
        onChange={onChange}
        slotProps={{
          textField: ({ position }) => ({
            label: position === 'start' ? 'Начало' : 'Конец',
            variant: 'outlined',
            size: 'small',
          }),
        }}
      />

      <StaticDateRangePicker<dayjs.Dayjs>
        onChange={onChange}
        value={value}
        calendars={calendars}
        minDate={minDate}
        localeText={{ toolbarTitle: label, start: 'Начало', end: 'Конец' }}
        shouldDisableDate={(date) =>
          disableDates.some((dateToDisable) => date.isAfter(dateToDisable.start) && date.isBefore(dateToDisable.end))
        }
        sx={{
          '& .MuiDialogActions-root': { display: 'none' },
        }}
      />
    </LocalizationProvider>
  );
};

export const DatePickerMUI = ({
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
      <DatePicker<dayjs.Dayjs>
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
