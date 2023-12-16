import { AxiosError } from 'axios';
import { redirect } from 'next/navigation';
import BookingLayout from 'components/BookingPage/BookingLayout';
import axios from 'core/axios';
import pluralize from 'core/helpers/pluralize';
import { CreateBookingBody } from 'core/types/Booking';
import { getCommonCommodities } from 'server/commodity';
import { getEntryByIdWithFutureWithService, getGroupById } from 'server/objects/ObjectCollection';

type Props = {
  params: { id: string };
  searchParams: { isPayment: boolean };
};

const onSubmit = async (bookingBody: CreateBookingBody) => {
  'use server';

  try {
    const res = await axios.post<{ number: string; token: string }>(
      `${process.env.NEXT_PUBLIC_CRM_URL}/api/bookings/public`,
      bookingBody,
      {
        headers: {
          'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY as string,
        },
      }
    );

    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const BookingId = async ({ params, searchParams }: Props) => {
  const entry = await getEntryByIdWithFutureWithService(params.id);

  if (!entry) {
    return redirect('/not-found');
  }

  const group = await getGroupById(entry?.group.id);
  const commonCommodities = await getCommonCommodities();

  return (
    <BookingLayout
      onSubmit={onSubmit}
      isPaymentStep={searchParams.isPayment}
      entry={entry}
      commonCommodities={commonCommodities}
      tabs={
        group?.entries.map((entry) => ({
          label: `${entry.seats} ${pluralize(['человек', 'человека', 'человек'], entry.seats)}`,
          value: String(entry.id),
        })) ?? []
      }
    />
  );
};

export default BookingId;
