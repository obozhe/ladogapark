import dayjs from 'dayjs';
import { getBookingById } from 'server/bookings';
import { getClientById } from 'server/client';

type Props = {
  params: {
    id: string;
  };
  searchParams: {
    token?: string;
  };
};

const Order = async ({ params: { id }, searchParams: { token } }: Props) => {
  const booking = await getBookingById(id);

  if (!booking) {
    return <main className="layout-container flex h-full items-center justify-center">Бронирование не найдено</main>;
  }
  const client = await getClientById(booking.clientId);

  // Change to booking.token
  const isAuthorized = Math.random() > 0.5;

  return (
    <main className="layout-container">
      <h2>Бронирование #{booking.number}</h2>
      <p>
        {dayjs(booking.start).format('dd.MM.YYYY')} - {dayjs(booking.end).format('dd.MM.YYYY')}
      </p>
      <p> Статус - {booking.status}</p>
      <p>Всего - {booking.total}</p>
      <ol>
        <li>Фамилия: {isAuthorized ? client?.name : `${client?.name[0]}***`}</li>
        <li>Почта: {isAuthorized ? client?.email : `${client?.email[0]}***`}</li>
        <li>Телефон: {isAuthorized ? client?.phone : `${client?.phone.slice(0, 2)}***`}</li>
      </ol>
    </main>
  );
};

export default Order;
