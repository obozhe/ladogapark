'use client';

import ArrowCircleIcon from 'icons/arrow-circle.svg';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  title: string;
  description: string;
  isOpen?: boolean;
};

const Disclosure = ({ title, description, isOpen = false }: Props) => {
  const [showFull, setShowFull] = useState(isOpen);

  return (
    <div
      className={twMerge(
        'border-t-2 last:border-b-2 border-black py-4 grid grid-rows-disclosure-0 transition-[grid-template-rows] duration-300',
        showFull && 'grid-rows-disclosure-2'
      )}
    >
      <div className={twMerge('flex justify-between items-center', showFull && 'mb-4')}>
        <span className="font-semibold text-2xl cursor-pointer" onClick={() => setShowFull((prev) => !prev)}>
          {title}
        </span>
        <span className={twMerge('rotate-180', showFull && 'rotate-0')}>
          <ArrowCircleIcon />
        </span>
      </div>
      <p className="font-semibold overflow-hidden">{description}</p>
    </div>
  );
};

export default Disclosure;
