import axios from 'axios';
import dayjs from 'dayjs';
import { redirect } from 'next/navigation';
import { PaymentStatus, PaymentType } from '@prisma/client';
import pluralize from 'core/helpers/pluralize';
import { getBookingById } from 'server/bookings';
import { getClientById } from 'server/client';
import { getUnitByIdWithEntryWithGroup } from 'server/objects/ObjectCollection';
import { getPaymentByBookingId } from 'server/payments';

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
  const payment = await getPaymentByBookingId(booking.id);
  const unit = await getUnitByIdWithEntryWithGroup(booking.unitId);

  console.log(booking);
  if (payment.length) {
    console.log(payment[0].token);
    const shopId = process.env.NEXT_PUBLIC_YOOKASSA_SHOP_ID as string;
    const secretKey = process.env.NEXT_PUBLIC_YOOKASSA_API as string;
    const t = Buffer.from(`${shopId}:${secretKey}`, 'utf8').toString('base64');

    const yokassaRes = await axios.get(`https://api.yookassa.ru/v3/payments/${payment[0].token}`, {
      headers: {
        Authorization: `Basic ${t}`,
        'Content-Type': 'application/json',
        'Idempotence-Key': String(booking.number),
      },
    });

    console.log(yokassaRes.data);
    //TODO: if status = success update payment
  }

  const client = booking.clientId ? await getClientById(booking?.clientId) : JSON.parse(booking.tempClient!);
  const isAuthorized = token === booking.token;

  const paymentAmount = booking.commoditiesOrders.reduce((acc, commodity) => acc + commodity.total, booking.total);

  const pay = async () => {
    'use server';

    const shopId = process.env.NEXT_PUBLIC_YOOKASSA_SHOP_ID as string;
    const secretKey = process.env.NEXT_PUBLIC_YOOKASSA_API as string;
    const t = Buffer.from(`${shopId}:${secretKey}`, 'utf8').toString('base64');

    const body = {
      amount: {
        value: `${booking.total}.00`,
        currency: 'RUB',
      },
      capture: true,
      confirmation: {
        type: 'redirect',
        return_url: `http://localhost:3000/orders/${booking.number}?token=${booking.token}`,
      },
    };

    const yookassaRes = await fetch('https://api.yookassa.ru/v3/payments', {
      method: 'POST',

      headers: {
        Authorization: `Basic ${t}`,
        'Content-Type': 'application/json',
        'Idempotence-Key': String(booking.number),
      },
      body: JSON.stringify(body),
    });
    const yookassa = await yookassaRes.json();

    const paymentsRes = await axios
      .post(
        `${process.env.NEXT_PUBLIC_CRM_URL}/api/payments`,
        {
          amount: paymentAmount,
          bookingId: booking.id,
          status: PaymentStatus.Pending,
          token: yookassa.id,
          paidDate: dayjs().toISOString(),
          type: PaymentType.Electronic,
        },
        {
          headers: {
            'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY as string,
          },
        }
      )
      .catch((e) => console.log(e));
    console.log(paymentsRes);

    // redirect(yookassa.confirmation.confirmation_url);
  };

  return (
    <main className="layout-container">
      <h2 className="mb-14">Бронирование #{booking.number}</h2>
      <div className="flex justify-between">
        <div>
          <div className="text flex flex-col gap-2 pb-5 text-xl font-semibold">
            <span>{unit?.entry.title}</span>
            <span>
              {`${dayjs(booking.start).format('DD MMMM YYYY')} ${unit?.entry.group.startHour}:00`} -
              {`${dayjs(booking.end).format('DD MMMM YYYY')} ${unit?.entry.group.endHour}:00`}
            </span>
            <span>Статус: </span>
          </div>
          <div className="py-5">
            {`${booking.commoditiesOrders.length} ${pluralize(
              ['дополнительный человек', 'дополнительных товара', 'дополнительных товаров'],
              booking.commoditiesOrders.length
            )}`}
          </div>
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
          <form action={pay}>
            <button>send</button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Order;
