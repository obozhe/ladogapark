import { sanitize } from 'isomorphic-dompurify';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { ObjectEntry } from '@prisma/client';
import Bill from 'components/BookingPage/Bill';
import { getObjectEntryById } from 'server/objects/ObjectCollection';
import HouseTest from '../../../../../uploads/objects/test-house.png';

type Props = {
  params: { id: string };
};

type InfoProps = {
  objectEntry: ObjectEntry;
};

const Info = ({ objectEntry }: InfoProps) => {
  console.log(objectEntry);
  return (
    <section className="flex flex-col gap-7">
      <Image src={HouseTest} alt="house image" className="w-full" />
      <div className="flex flex-col gap-2 font-semibold">
        <p className="text-xl">{objectEntry.title}</p>
        <p>{objectEntry.description}</p>
        <div
          dangerouslySetInnerHTML={{
            __html: sanitize(objectEntry.content),
          }}
        />
      </div>
    </section>
  );
};

const BookingId = async ({ params }: Props) => {
  const objectEntry = await getObjectEntryById(params.id);

  if (!objectEntry) {
    return redirect('/not-found');
  }

  return (
    <div className="grid grid-cols-[2fr_1fr] gap-12">
      <Info objectEntry={objectEntry} />
      <Bill objectEntry={objectEntry} />
    </div>
  );
};

export default BookingId;
