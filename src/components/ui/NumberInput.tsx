'use client';

import { IconMinus, IconPlus } from '@tabler/icons-react';
import { ChangeEvent, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useDidUpdateEffect } from 'hooks/useDidUpdateEffect';
import useLatest from 'hooks/useLatest';

type Props = {
  placeholder: string;
  onChange: (value: number) => void;
  iconTheme?: 'black' | 'white';
  min?: number;
  max?: number;
  value?: number;
  className?: string;
};

const NumberInput = ({ placeholder, min, max, onChange, value, className }: Props) => {
  const [inputValue, setInputValue] = useState(value ?? 0);
  const latestOnChange = useLatest(onChange);

  const decrease = () => {
    if (!inputValue || inputValue < (min ?? Number.MIN_SAFE_INTEGER)) return;

    setInputValue((prev) => prev - 1);
  };

  const increase = () => {
    if (inputValue >= (max ?? Number.MAX_SAFE_INTEGER)) return;

    setInputValue((prev) => prev + 1);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (newValue > (max ?? Number.MAX_SAFE_INTEGER) || newValue < (min ?? Number.MIN_SAFE_INTEGER)) return;

    setInputValue(newValue);
  };

  useDidUpdateEffect(() => {
    latestOnChange.current(inputValue);
  }, [inputValue, latestOnChange]);

  return (
    <div className="flex flex-col gap-[5px]">
      <span className="text-sm font-semibold text-tertiary">{placeholder}</span>
      <div className={twMerge('relative h-full w-full font-semibold focus-within:border-primary', className)}>
        <input
          className="h-full min-h-[50px] w-full rounded-[10px] pl-[10px] focus:outline-none"
          type="number"
          pattern="[0-9]*"
          inputMode="decimal"
          value={inputValue || ''}
          onChange={handleChange}
          min={0}
          max={100}
        />
        <div className="absolute right-[2px] top-1/2 flex h-full -translate-y-1/2 items-center gap-1">
          <button className="flex h-[calc(100%-4px)] cursor-pointer items-center" onClick={decrease}>
            <IconMinus />
          </button>
          <button className="flex h-[calc(100%-4px)] cursor-pointer items-center" onClick={increase}>
            <IconPlus />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NumberInput;
