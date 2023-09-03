import { getBookingById } from 'server/bookings';

type Props = {
  params: { id: string };
};

const Payment = async ({ params }: Props) => {
  const booking = await getBookingById(params.id);

  return <div>payment</div>;
};

export default Payment;
