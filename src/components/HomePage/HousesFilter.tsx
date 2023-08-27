'use client';

import dayjs from 'dayjs';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import Button from 'ui/Button';
import DatePicker from 'ui/DatePicker';

const HousesFilter = () => {
  const [isTransition, startTransition] = useTransition();
  const [date, setDate] = useState<dayjs.Dayjs>();
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    if (!date) return;

    const newSearchParams = new URLSearchParams();
    newSearchParams.set('from', date.format());

    startTransition(() => {
      router.push(`${pathname}?${newSearchParams.toString()}`);
    });
  };

  return (
    <div className="grid md:grid-cols-[2fr,1fr] md:grid-rows-1 grid-cols-[minmax(250px,1fr)] grid-rows-2 gap-3">
      <DatePicker placeholderText="Дата заезда" onChange={(value) => setDate(value)} minDate={new Date()} />
      <Button size="xxl" color="primary" className="w-full md:w-fit" type="submit" onClick={handleClick}>
        {isTransition ? 'loading...' : 'Показать объекты'}
      </Button>
    </div>
  );
};

export default HousesFilter;
