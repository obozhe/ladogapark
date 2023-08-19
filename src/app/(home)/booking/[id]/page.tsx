import { sanitize } from 'isomorphic-dompurify';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { Entry } from '@prisma/client';
import Bill from 'components/BookingPage/Bill';
import BookingTabs from 'components/BookingPage/BookingTabs';
import { getEntryById, getGroupById } from 'server/objects/ObjectCollection';
import HouseTest from '../../../../../public/images/test-house.png';

type Props = {
  params: { id: string };
  searchParams: { seats: string };
};

type InfoProps = {
  entry: Entry;
};

const Info = ({ entry }: InfoProps) => {
  console.log(entry);
  return (
    <section className="flex flex-col gap-7">
      <Image src={HouseTest} alt="house image" className="w-full" />
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
  const entry = await getEntryById(params.id);

  if (!entry) {
    return redirect('/not-found');
  }

  const group = await getGroupById(entry?.group.id);

  return (
    <div className="flex flex-col gap-5 mt-12">
      <BookingTabs
        activeTab={String(entry.id)}
        tabs={group?.entries.map((entry) => ({ label: `${entry.seats} человека`, value: String(entry.id) })) ?? []}
      />
      <div className="grid grid-cols-[2fr_1fr] gap-12">
        <Info entry={entry} />
        <Bill entry={entry} />
      </div>
    </div>
  );
};

export default BookingId;
