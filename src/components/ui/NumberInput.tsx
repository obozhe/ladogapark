'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { Minus, Plus } from 'tabler-icons-react';

type Props = {
  placeholder: string;
  onChange: (value: number) => void;
  iconTheme?: 'black' | 'white';
  min?: number;
  max?: number;
};

const NumberInput = ({ placeholder, min, max, onChange }: Props) => {
  const [value, setValue] = useState(0);

  const decrease = () => {
    if (!value) return;

    setValue((prev) => prev - 1);
  };

  const increase = () => {
    setValue((prev) => prev + 1);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (newValue > (max ?? Number.MAX_SAFE_INTEGER) || newValue < (min ?? Number.MIN_SAFE_INTEGER)) return;

    setValue(newValue);
  };

  useEffect(() => {
    onChange(value);
  }, [value, onChange]);

  return (
    <div className="relative w-full h-full font-semibold">
      <input
        className="h-full w-full rounded-[10px] pl-[10px] min-h-[50px]"
        type="number"
        pattern="[0-9]*"
        inputMode="decimal"
        placeholder={placeholder}
        value={value || ''}
        onChange={handleChange}
        min={0}
        max={100}
      />
      <div className="absolute right-[2px] top-1/2 -translate-y-1/2 flex items-center gap-1 h-full">
        <button className="h-[calc(100%-4px)] flex items-center cursor-pointer" onClick={decrease}>
          <Minus />
        </button>
        <button className="h-[calc(100%-4px)] flex items-center cursor-pointer" onClick={increase}>
          <Plus />
        </button>
      </div>
    </div>
  );
};

export default NumberInput;
