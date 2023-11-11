import { YooCheckout } from '@a2seven/yoo-checkout';
import { redirect } from 'next/navigation';
import BookingLayout from 'components/BookingPage/BookingLayout';
import pluralize from 'core/helpers/pluralize';
import { getCommonCommodities } from 'server/commodity';
import { getEntryByIdWithFutureWithService, getGroupById } from 'server/objects/ObjectCollection';

type Props = {
  params: { id: string };
  searchParams: { isPayment: boolean };
};

// TODO: store payment id in session storage -> redirect to our confirm payment page -> send request with id in session storage -> store this id in db and delete id from session storage
const onSubmit = async () => {
  'use server';

  const shopId = process.env.NEXT_PUBLIC_YOOKASSA_SHOP_ID as string;
  const secretKey = process.env.NEXT_PUBLIC_YOOKASSA_API as string;
  const t = Buffer.from(`${shopId}:${secretKey}`, 'utf8').toString('base64');
  // const booking = await createBooking(total, dayjs(), dayjs().add(1, 'd'), entryId);

  const body = {
    amount: {
      value: '100.00',
      currency: 'RUB',
    },
    capture: true,
    confirmation: {
      type: 'redirect',
      return_url: `http://localhost:3000/payment/${13}`,
    },
    description: 'Заказ №1',
    metadata: { id: '123' },
  };

  // console.log('here', body);

  // const checkout = new YooCheckout({ shopId, secretKey });
  // const paymentList = await checkout.getPaymentList();
  // console.log(paymentList);

  const res = await fetch('https://api.yookassa.ru/v3/deals', {
    method: 'GET',
    headers: {
      'Idempotence-Key': String(Math.random()),
      'Content-Type': 'application/json',
      Authorization: `Basic ${t}`,
    },
  });

  console.log(res);

  // const res = await fetch('https://api.yookassa.ru/v3/payments', {
  //   method: 'POST',

  //   headers: {
  //     Authorization: `Basic ${t}`,
  //     'Content-Type': 'application/json',
  //     'Idempotence-Key': String(Math.random()),
  //   },
  //   body: JSON.stringify(body),
  // });
  // const json = (await res.json()) as {
  //   id: string;
  //   status: 'pending';
  //   amount: { value: string; currency: 'RUB' };
  //   description: string;
  //   recipient: { account_id: string; gateway_id: string };
  //   created_at: string;
  //   confirmation: {
  //     type: 'redirect';
  //     confirmation_url: string;
  //   };
  //   test?: boolean;
  //   paid: boolean;
  //   refundable: boolean;
  //   metadata: { id: '123' };
  // };
  // await updatePaymentToken(booking.id, json.id);
  // redirect(json.confirmation.confirmation_url);
};

const BookingId = async ({ params, searchParams }: Props) => {
  const entry = await getEntryByIdWithFutureWithService(params.id);

  if (!entry) {
    return redirect('/not-found');
  }

  const group = await getGroupById(entry?.group.id);
  const commonCommodities = await getCommonCommodities();

  return (
    <>
      <BookingLayout
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
      <form action={onSubmit}>
        <button>asd</button>
      </form>
    </>
  );
};

export default BookingId;
