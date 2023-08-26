import { IconMan } from '@tabler/icons-react';
import Link from 'next/link';
import { Entry } from '@prisma/client';
import formatToRuble from 'core/helpers/number';
import HousesTabs from './HousesTabs';

type Props = {
  objectEntries: Entry[];
};

const Houses = ({ objectEntries }: Props) => {
  return (
    <section className="flex flex-col gap-8">
      <h2>Каталог домов</h2>
      <div className="flex justify-between flex-col md:flex-row gap-10">
        <HousesTabs />
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
              href={`booking/${entry.id}?seats=${entry.seats}`}
              className="relative h-64 text-white font-semibold flex flex-col justify-between font-inter"
              key={entry.id}
            >
              <div className="absolute top-0 h-full w-full brightness-[60%] -z-10 bg-house-image bg-auto bg-left-top" />
              <div className="flex justify-between p-2 md:p-4">
                <div className="flex items-center">
                  <IconMan fill="white" />
                  <span>x{entry.seats}</span>
                </div>
                <div className="flex gap-2">
                  <span className="bg-primary rounded-md p-1 text-xs">{formatToRuble(entry.priceWeekday)}</span>
                  <span className="bg-secondary rounded-md p-1 text-xs">{formatToRuble(entry.priceWeekend)}</span>
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
