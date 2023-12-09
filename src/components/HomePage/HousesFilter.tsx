'use client';

import dayjs from 'dayjs';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import Button from 'ui/Button';
import DatePicker from 'ui/DatePicker';

const HousesFilter = () => {
  const [isTransition, startTransition] = useTransition();
  const [date, setDate] = useState<dayjs.Dayjs | null>();
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
    <div className="grid grid-cols-[minmax(250px,1fr)] grid-rows-2 gap-3 md:grid-cols-[2fr,1fr] md:grid-rows-1">
      <DatePicker
        placeholder="Дата заезда"
        onChange={(value) => setDate(value ? dayjs(value) : null)}
        minDate={new Date()}
        selectsRange={false}
      />
      <Button size="xxl" color="primary" className="w-full md:w-fit" type="submit" onClick={handleClick}>
        {isTransition ? 'loading...' : 'Показать объекты'}
      </Button>
    </div>
  );
};

export default HousesFilter;
