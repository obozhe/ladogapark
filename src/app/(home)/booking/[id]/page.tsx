import { sanitize } from 'isomorphic-dompurify';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import Bill from 'components/BookingPage/Bill';
import BookingTabs from 'components/BookingPage/BookingTabs';
import pluralize from 'core/helpers/pluralize';
import { EntryWithFuturePricesWithGroup } from 'core/types/Prisma';
import { getEntryByIdWithFuturePrices, getGroupById } from 'server/objects/ObjectCollection';
import HouseTest from '../../../../../public/images/test-house.png';

type Props = {
  params: { id: string };
  searchParams: { seats: string };
};

type InfoProps = {
  entry: EntryWithFuturePricesWithGroup;
};

const Info = ({ entry }: InfoProps) => {
  return (
    <section className="flex flex-col gap-7">
      <div className="flex flex-col gap-5">
        <div>
          <Image src={HouseTest} alt="house image" className="w-full" />
        </div>
        <div className="flex gap-1 overflow-auto">
          <Image src={HouseTest} alt="house image" className="max-h-24 max-w-24" />
          <Image src={HouseTest} alt="house image" className="max-h-24 max-w-24" />
          <Image src={HouseTest} alt="house image" className="max-h-24 max-w-24" />
          <Image src={HouseTest} alt="house image" className="max-h-24 max-w-24" />
          <Image src={HouseTest} alt="house image" className="max-h-24 max-w-24" />
          <Image src={HouseTest} alt="house image" className="max-h-24 max-w-24" />
          <Image src={HouseTest} alt="house image" className="max-h-24 max-w-24" />
          <Image src={HouseTest} alt="house image" className="max-h-24 max-w-24" />
        </div>
      </div>
      <div className="flex flex-col gap-2 font-semibold">
        <p className="text-xl">{entry.title}</p>
        <p>{entry.description}</p>
        <div
          dangerouslySetInnerHTML={{
            __html: sanitize(entry.content),
          }}
        />
      </div>
    </section>
  );
};

const BookingId = async ({ params, searchParams }: Props) => {
  const entry = await getEntryByIdWithFuturePrices(params.id);

  if (!entry) {
    return redirect('/not-found');
  }

  const group = await getGroupById(entry?.group.id);

  return (
    <div className="flex flex-col gap-5 mt-12">
      <BookingTabs
        activeTab={String(entry.id)}
        tabs={
          group?.entries.map((entry) => ({
            label: `${entry.seats} ${pluralize(['человек', 'человека', 'человек'], entry.seats)}`,
            value: String(entry.id),
          })) ?? []
        }
      />
      <div className="grid grid-cols-[2fr_1fr] gap-12">
        <Info entry={entry} />
        <Bill entry={entry} />
      </div>
    </div>
  );
};

export default BookingId;
