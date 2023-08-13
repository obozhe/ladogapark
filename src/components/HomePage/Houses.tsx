'use client';

import HumanIcon from 'icons/human.svg';
import Link from 'next/link';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { ObjectEntry } from '@prisma/client';
import { ObjectTypes } from 'server/objects/types';
import Tabs from 'ui/Tabs';

type Props = {
  objectEntries: ObjectEntry[];
};
const rentOptions: Record<'label' | 'value', string | ObjectTypes>[] = [
  { label: 'На сутки', value: ObjectTypes.House },
  { label: 'На день', value: ObjectTypes.Daily },
  { label: 'Бани', value: ObjectTypes.Bath },
];

const Houses = ({ objectEntries }: Props) => {
  const [activeOption, sentActiveOption] = useState(rentOptions[0]);

  return (
    <section className="flex flex-col gap-8">
      <h2>Каталог домов</h2>
      <div className="flex justify-between flex-col md:flex-row gap-10">
        <Tabs tabs={rentOptions} />
        {/* {rentOptions.map((option) => {
            return (
              <span
                key={option.value}
                onClick={() => sentActiveOption(option)}
                className={twMerge(
                  'border-3 rounded-md border-black py-1 px-2 font-semibold text-lg cursor-pointer',
                  activeOption === option && 'bg-primary text-white border-primary'
                )}
              >
                {option.label}
              </span>
            );
          })} */}
        <div className="flex flex-col font-semibold text-xs font-inter text-black gap-1 -order-1 md:order-1">
          <div className="flex gap-2 items-center">
            <div className="bg-secondary w-4 h-4" />
            <span>Пятница - Воскресенье</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="bg-primary w-4 h-4" />
            <span>Понедельник - Четверг</span>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 sm:grid-cols-1 gap-9">
        {objectEntries.map((entry) => {
          return (
            <Link
              href={'booking/' + entry.id}
              className="relative h-64 text-white font-semibold flex flex-col justify-between font-inter"
              key={entry.id}
            >
              <div className="absolute top-0 h-full w-full brightness-[60%] -z-10 bg-house-image bg-auto bg-left-top" />
              <div className="flex justify-between p-2 md:p-4">
                <div className="flex items-center">
                  <span>
                    <HumanIcon />
                  </span>
                  <span>x{entry.seats}</span>
                </div>
                <div className="flex gap-2">
                  <span className="bg-primary rounded-md p-1 text-xs">{entry.priceWeekdays} ₽</span>
                  <span className="bg-secondary rounded-md p-1 text-xs">{entry.priceWeekends} ₽</span>
                </div>
              </div>
              <span className="p-2 md:p-4 font-semibold text-4xl">{entry.title}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Houses;
