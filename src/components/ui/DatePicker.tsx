'use client';

import useOutsideClick from 'hooks/useOutsideClick';
import { TextFieldProps } from '@mui/material';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker as DatePickerMUI } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import '../../../public/datePicker.css';
import Input from './Input';

type DatePickerRangeProps = {
  start: string;
  end: string;
  onChange: () => void;
};

type DatePickerProps = {
  label: string;
  onChange: () => void;
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
      className="border-none m-0:important"
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

const DatePickerRange = ({ start, end }: DatePickerRangeProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <DateRangePicker
        localeText={{ start, end }}
        slots={{
          textField: CustomInput,
        }}
        slotProps={{ fieldSeparator: { children: '' }, textField: { margin: 'none' } }}
        onOpen={removeLicenseNotification}
      />
    </LocalizationProvider>
  );
};

const DatePicker = ({ label, onChange }: DatePickerProps) => {
  const { open, ref, setOpen } = useOutsideClick<HTMLDivElement>();

  return (
    <div ref={ref}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
        <DatePickerMUI
          open={open}
          label={label}
          onChange={(value) => {
            onChange();
            setOpen(false);
          }}
          onOpen={removeLicenseNotification}
          slotProps={{
            textField: {
              onClick: () => setOpen((prev) => !prev),
            },
          }}
          slots={{
            textField: CustomInput,
          }}
        />
      </LocalizationProvider>
    </div>
  );
};

export { DatePicker, DatePickerRange };
