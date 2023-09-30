'use client';

import { IconMinus, IconPlus } from '@tabler/icons-react';
import { ChangeEvent, useState } from 'react';
import { useDidUpdateEffect } from 'hooks/useDidUpdateEffect';
import useLatest from 'hooks/useLatest';

type Props = {
  placeholder: string;
  onChange: (value: number) => void;
  iconTheme?: 'black' | 'white';
  min?: number;
  max?: number;
  value?: number;
};

const NumberInput = ({ placeholder, min, max, onChange, value }: Props) => {
  const [inputValue, setInputValue] = useState(value ?? 0);
  const latestOnChange = useLatest(onChange);

  const decrease = () => {
    if (!inputValue) return;

    setInputValue((prev) => prev - 1);
  };

  const increase = () => {
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
    <div className="relative h-full w-full font-semibold">
      <input
        className="h-full min-h-[50px] w-full rounded-[10px] pl-[10px]"
        type="number"
        pattern="[0-9]*"
        inputMode="decimal"
        placeholder={placeholder}
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
  );
};

export default NumberInput;
