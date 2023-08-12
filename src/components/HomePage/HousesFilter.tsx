'use client';

import dayjs from 'dayjs';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import Button from 'ui/Button';
import DatePicker from 'ui/DatePicker';
import NumberInput from 'ui/NumberInput';

const HousesFilter = () => {
  const [isTransition, startTransition] = useTransition();
  const [date, setDate] = useState<dayjs.Dayjs>();
  const [nightsAmount, setNightAmount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    console.log(date, nightsAmount);
    if (!date || !nightsAmount) return;

    const newSearchParams = new URLSearchParams();
    newSearchParams.set('from', date.format());
    newSearchParams.set('to', date.add(nightsAmount, 'day').format());

    startTransition(() => {
      router.push(`${pathname}?${newSearchParams.toString()}`);
    });
  };

  console.log(nightsAmount);

  return (
    <>
      <DatePicker placeholderText="Дата заезда" onChange={(value) => setDate(value)} minDate={new Date()} />
      <NumberInput placeholder="Кол-во ночей" iconTheme="black" onChange={setNightAmount} />
      <Button size="xxl" color="primary" className="w-full md:w-fit" type="submit" onClick={handleClick}>
        {isTransition ? 'loading...' : 'Показать объекты'}
      </Button>
    </>
  );
};

export default HousesFilter;
