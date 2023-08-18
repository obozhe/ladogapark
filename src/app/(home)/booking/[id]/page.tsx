import { sanitize } from 'isomorphic-dompurify';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { Entry } from '@prisma/client';
import Bill from 'components/BookingPage/Bill';
import { getEntryById } from 'server/objects/ObjectCollection';
import HouseTest from '../../../../../public/images/test-house.png';

type Props = {
  params: { id: string };
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

const BookingId = async ({ params }: Props) => {
  const entry = await getEntryById(params.id);

  if (!entry) {
    return redirect('/not-found');
  }

  return (
    <div className="grid grid-cols-[2fr_1fr] gap-12 mt-12">
      <Info entry={entry} />
      <Bill entry={entry} />
    </div>
  );
};

export default BookingId;
