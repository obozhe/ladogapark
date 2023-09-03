import dayjs, { Dayjs } from 'dayjs';
import { sanitize } from 'isomorphic-dompurify';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import Bill from 'components/BookingPage/Bill';
import BookingTabs from 'components/BookingPage/BookingTabs';
import pluralize from 'core/helpers/pluralize';
import { EntryWithFuturePricesWithGroup } from 'core/types/Prisma';
import { createBooking, updatePaymentToken } from 'server/bookings';
import {
  getEntryByIdWithFuturePrices,
  getEntryByIdWithFutureWithService,
  getGroupById,
} from 'server/objects/ObjectCollection';
import HouseTest from '../../../../../public/images/test-house.png';

type Props = {
  params: { id: string };
};

type InfoProps = {
  entry: EntryWithFuturePricesWithGroup;
};

// TODO: store payment id in session storage -> redirect to our confirm payment page -> send request with id in session storage -> store this id in db and delete id from session storage
const onSubmit = async ({
  total,
  entryId,
  startDate,
  endDate,
}: {
  total: number;
  entryId: string;
  startDate: string;
  endDate: string;
}) => {
  'use server';

  const shopId = process.env.YOOKASSA_SHOP_ID as string;
  const secretKey = process.env.YOOKASSA_API as string;
  const t = Buffer.from(`${shopId}:${secretKey}`, 'utf8').toString('base64');
  const booking = await createBooking(total, dayjs(), dayjs().add(1, 'd'), entryId);

  const body = {
    amount: {
      value: '100.00',
      currency: 'RUB',
    },
    capture: true,
    confirmation: {
      type: 'redirect',
      return_url: `http://localhost:3000/payment/${booking.id}`,
    },
    description: 'Заказ №1',
    metadata: { id: '123' },
  };

  const res = await fetch('https://api.yookassa.ru/v3/payments', {
    method: 'POST',

    headers: {
      Authorization: `Basic ${t}`,
      'Content-Type': 'application/json',
      'Idempotence-Key': String(Math.random()),
    },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as {
    id: string;
    status: 'pending';
    amount: { value: string; currency: 'RUB' };
    description: string;
    recipient: { account_id: string; gateway_id: string };
    created_at: string;
    confirmation: {
      type: 'redirect';
      confirmation_url: string;
    };
    test?: boolean;
    paid: boolean;
    refundable: boolean;
    metadata: { id: '123' };
  };
  await updatePaymentToken(booking.id, json.id);
  redirect(json.confirmation.confirmation_url);
};

const Info = ({ entry }: InfoProps) => {
  return (
    <section className="flex flex-col gap-7">
      <div className="flex flex-col gap-5">
        <div>
          <Image src={HouseTest} alt="house image" className="w-full" />
        </div>
        <div className="flex gap-1 overflow-auto">
          <Image src={HouseTest} alt="house image" className="max-w-24 max-h-24" />
          <Image src={HouseTest} alt="house image" className="max-w-24 max-h-24" />
          <Image src={HouseTest} alt="house image" className="max-w-24 max-h-24" />
          <Image src={HouseTest} alt="house image" className="max-w-24 max-h-24" />
          <Image src={HouseTest} alt="house image" className="max-w-24 max-h-24" />
          <Image src={HouseTest} alt="house image" className="max-w-24 max-h-24" />
          <Image src={HouseTest} alt="house image" className="max-w-24 max-h-24" />
          <Image src={HouseTest} alt="house image" className="max-w-24 max-h-24" />
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

const BookingId = async ({ params }: Props) => {
  const entry = await getEntryByIdWithFutureWithService(params.id);

  if (!entry) {
    return redirect('/not-found');
  }

  const group = await getGroupById(entry?.group.id);

  return (
    <div className="mt-12 flex flex-col gap-5">
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
        <Bill entry={entry} onSubmit={onSubmit} />
      </div>
    </div>
  );
};

export default BookingId;
