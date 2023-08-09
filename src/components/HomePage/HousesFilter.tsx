'use client';

import dayjs from 'dayjs';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { DateRange } from '@mui/x-date-pickers-pro';
import Button from 'ui/Button';
import { DatePickerRange } from 'ui/DatePicker';
import Loader from 'ui/Loader';

const HousesFilter = () => {
  const [isTransition, startTransition] = useTransition();
  const [dateRange, setDateRange] = useState<DateRange<dayjs.Dayjs>>([null, null]);
  const router = useRouter();
  const pathname = usePathname();

  const handleButton = () => {
    if (!dateRange[0] || !dateRange[1]) return;

    const newSearchParams = new URLSearchParams();
    newSearchParams.set('from', dateRange[0].format());
    newSearchParams.set('to', dateRange[1].format());

    startTransition(() => {
      router.push(`${pathname}?${newSearchParams.toString()}`);
    });
  };

  return (
    <>
      <DatePickerRange start="Дата заезда" end="Дата выезда" onChange={(value) => setDateRange(value)} />
      <Button size="xxl" color="primary" className="w-full md:w-fit" type="submit" onClick={handleButton}>
        {isTransition ? <Loader /> : 'Показать объекты'}
      </Button>
    </>
  );
};

export default HousesFilter;
