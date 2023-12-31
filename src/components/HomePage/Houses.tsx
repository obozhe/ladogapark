import { IconLoader2, IconMan } from '@tabler/icons-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { Entry } from '@prisma/client';
import { formatToRuble } from 'core/helpers/number';
import { getBookingsByDate } from 'server/bookings';
import { getObjectEntries } from 'server/objects/ObjectCollection';
import { ObjectTypes } from 'server/objects/types';
import HousesTabs from './HousesTabs';

type Props = {
  entryType: ObjectTypes;
  from: string;
};

export const House = ({ entry }: { entry: Entry }) => {
  return (
    <Link
      href={`booking/${entry.id}`}
      className="relative flex h-64 flex-col justify-between font-inter font-semibold text-white"
    >
      <div className="absolute top-0 -z-10 h-full w-full bg-house-image bg-auto bg-left-top brightness-[60%]" />
      <div className="flex justify-between p-2 md:p-4">
        <div className="flex items-center">
          <IconMan fill="white" />
          <span>x{entry.seats}</span>
        </div>
        <div className="flex gap-2">
          <span className="rounded-md bg-primary p-1 text-xs">{formatToRuble(entry.priceWeekday)}</span>
          <span className="rounded-md bg-secondary p-1 text-xs">{formatToRuble(entry.priceWeekend)}</span>
        </div>
      </div>
      <span className="p-2 text-4xl font-semibold md:p-4">{entry.title}</span>
    </Link>
  );
};

const ObjectEntries = async ({ entryType, from }: Props) => {
  const objectEntries = await getObjectEntries(entryType);
  const bookings = from && (await getBookingsByDate(new Date(from)));

  return (
    <div className="grid gap-9 sm:grid-cols-1 lg:grid-cols-3">
      {objectEntries.map((entry) => (
        <House entry={entry} key={entry.id} />
      ))}
    </div>
  );
};

const Houses = async ({ entryType, from }: Props) => {
  return (
    <section className="flex flex-col gap-8">
      <h2 className="mobile-container">Каталог домов</h2>
      <div className="mobile-container flex flex-col justify-between gap-10 md:flex-row">
        <HousesTabs />
        <div className="-order-1 flex flex-col gap-1 font-inter text-xs font-semibold text-black md:order-1">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-secondary" />
            <span>Пятница - Воскресенье</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-primary" />
            <span>Понедельник - Четверг</span>
          </div>
        </div>
      </div>
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <div className="layout-container flex h-full flex-1 items-center justify-center">
              <IconLoader2 className="animate-spin" />
            </div>
          </div>
        }
      >
        <ObjectEntries entryType={entryType} from={from} />
      </Suspense>
    </section>
  );
};

export default Houses;
