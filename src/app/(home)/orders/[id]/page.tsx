import axios from 'axios';
import dayjs from 'dayjs';
import { redirect } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { BookingStatus, Payment, PaymentStatus, PaymentType, PromoCode } from '@prisma/client';
import PaymentButtons from 'components/OrdersPage/PaymentButtons';
import { bookingStatusTranslate } from 'core/bookingsStatusTranslate';
import { calculateDiscount, formatToRuble } from 'core/helpers/number';
import pluralize from 'core/helpers/pluralize';
import { YookassaPayment } from 'core/types/YookassaPayment';
import { getBookingById } from 'server/bookings';
import { getClientById } from 'server/client';
import { getUnitByIdWithEntryWithGroup } from 'server/objects/ObjectCollection';
import { UnitWithGroupWithEntry } from 'server/objects/types';
import { getPaymentByBookingId } from 'server/payments';
import { getPromoCodeById } from 'server/promoCode';
import Disclosure from 'ui/Disclosure';
import SubmitButton from 'ui/SubmitButton';

type Props = {
  params: {
    id: string;
  };
  searchParams: {
    token?: string;
    paymentType: 'full' | 'half';
  };
};

const Order = async ({ params: { id }, searchParams: { token, paymentType } }: Props) => {
  const booking = await getBookingById(id);
  let pendingYookassaPayment: YookassaPayment | null = null;

  if (!booking) {
    return <main className="layout-container flex h-full items-center justify-center">Бронирование не найдено</main>;
  }

  let payments: Payment[] = [],
    unit: UnitWithGroupWithEntry | null = null,
    promoCode: PromoCode | null = null;
  const [paymentResult, unitResult, promoCodeResult] = await Promise.allSettled([
    getPaymentByBookingId(booking.id),
    getUnitByIdWithEntryWithGroup(booking.unitId),
    getPromoCodeById(booking.promoCodeId ?? ''),
  ]);

  if (paymentResult.status === 'fulfilled') {
    payments = paymentResult.value;
  }

  if (unitResult.status === 'fulfilled') {
    unit = unitResult.value;
  }

  if (promoCodeResult.status === 'fulfilled') {
    promoCode = promoCodeResult.value;
  }
  const isNonPaidPayment = payments.filter((payment) => payment.status === PaymentStatus.Pending);

  console.log(payments);

  if (isNonPaidPayment.length) {
    const shopId = process.env.NEXT_PUBLIC_YOOKASSA_SHOP_ID as string;
    const secretKey = process.env.NEXT_PUBLIC_YOOKASSA_API as string;
    const t = Buffer.from(`${shopId}:${secretKey}`, 'utf8').toString('base64');

    for (let i = 0; i < isNonPaidPayment.length; i++) {
      const nonPaidPayment = isNonPaidPayment[i];

      try {
        const yookassaRes = await axios.get<YookassaPayment>(
          `https://api.yookassa.ru/v3/payments/${nonPaidPayment.token}`,
          {
            headers: {
              Authorization: `Basic ${t}`,
              'Content-Type': 'application/json',
              'Idempotence-Key': `${booking.number}-${nonPaidPayment.paidDate}`,
            },
          }
        );
        if (yookassaRes.data.status === 'succeeded') {
          const promises = payments.map((payment) =>
            axios.patch(
              `${process.env.NEXT_PUBLIC_CRM_URL}/api/payments/${payment.id}`,
              { status: PaymentStatus.Paid },
              {
                headers: {
                  'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY as string,
                },
              }
            )
          );
          await Promise.allSettled(promises);

          if (booking.commoditiesOrders.length) {
            const commoditiesPayment = payments.find(
              (payment) => payment.amount === booking.commoditiesOrders[0].total
            );
          }
        }
        if (yookassaRes.data.status === 'pending') {
          pendingYookassaPayment = yookassaRes.data;
        }
      } catch (e) {}
    }
  }

  const client = booking.clientId ? await getClientById(booking?.clientId) : JSON.parse(booking.tempClient!);
  const isAuthorized = token === booking.token;

  let paymentAmount = booking.total;
  if (promoCode) {
    paymentAmount = calculateDiscount({ price: paymentAmount, type: promoCode.type, discount: promoCode.discount });
  }
  if (paymentType === 'half') {
    paymentAmount = booking.prePay;
  }
  if (booking.status === BookingStatus.PrePaid) {
    const alreadyPaid = payments.reduce((acc, p) => acc + p.amount, 0);
    paymentAmount = booking.total - alreadyPaid;
  }

  const pay = async () => {
    'use server';
    const shopId = process.env.NEXT_PUBLIC_YOOKASSA_SHOP_ID as string;
    const secretKey = process.env.NEXT_PUBLIC_YOOKASSA_API as string;
    const t = Buffer.from(`${shopId}:${secretKey}`, 'utf8').toString('base64');

    const body = {
      amount: {
        value: `${paymentAmount}.00`,
        currency: 'RUB',
      },
      capture: true,
      confirmation: {
        type: 'redirect',
        return_url: `http://localhost:3000/orders/${booking.number}?token=${booking.token}`,
      },
    };
    const paidDate = dayjs().toISOString();

    if (!pendingYookassaPayment) {
      const yookassaRes = await axios.post('https://api.yookassa.ru/v3/payments', body, {
        headers: {
          Authorization: `Basic ${t}`,
          'Content-Type': 'application/json',
          'Idempotence-Key': `${booking.number}-${paidDate}`,
        },
      });

      await axios
        .post(
          `${process.env.NEXT_PUBLIC_CRM_URL}/api/payments`,
          {
            amount: paymentAmount,
            bookingId: booking.id,
            status: PaymentStatus.Pending,
            token: yookassaRes.data.id,
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

      redirect(yookassaRes.data.confirmation.confirmation_url);
    } else {
      redirect(pendingYookassaPayment?.confirmation.confirmation_url);
    }
  };

  return (
    <main className="layout-container">
      <h2 className="mb-14">Бронирование #{booking.number}</h2>
      <div className="flex justify-between">
        <div className="[&>*:nth-last-child(n+3)]:border-b-2">
          <div className="text flex flex-col gap-2 pb-5 text-xl font-semibold">
            <span>{unit?.entry.title}</span>
            <span>
              {`${dayjs(booking.start).format('DD MMMM YYYY')} ${unit?.entry.group.startHour}:00`} -
              {`${dayjs(booking.end).format('DD MMMM YYYY')} ${unit?.entry.group.endHour}:00`}
            </span>
            <span>
              Статус: <span className="text-secondary">{bookingStatusTranslate[booking.status]}</span>
            </span>
          </div>
          <div className="py-5 text-lg font-semibold">
            {booking.commoditiesOrders?.[0]?.commodities.length ? (
              <Disclosure
                showIcon={false}
                title={
                  <span className="text-primary">{`${booking.commoditiesOrders?.[0]?.commodities.length} ${pluralize(
                    ['дополнительный товар', 'дополнительных товара', 'дополнительных товаров'],
                    booking.commoditiesOrders?.[0]?.commodities.length
                  )}:`}</span>
                }
                description={booking.commoditiesOrders?.[0]?.commodities.map((commodity) => (
                  <div className="flex justify-between" key={commodity.id}>
                    <span>{commodity.commodity.title}</span>
                    <div className="flex gap-3">
                      <span>{formatToRuble(commodity.commodity.price * commodity.count)}</span>
                      <span>x{commodity.count}</span>
                    </div>
                  </div>
                ))}
                endAdornment={
                  <span className="text-lg text-primary">{formatToRuble(booking.commoditiesOrders[0].total)}</span>
                }
              />
            ) : (
              <div className="flex justify-between">
                <span>0 дополнительных товаров</span>
                <span>{formatToRuble(0)}</span>
              </div>
            )}
          </div>
          {booking.status !== BookingStatus.Paid && (
            <>
              <div className="grid auto-rows-min grid-cols-2 gap-5 py-5 text-2xl font-semibold">
                <span>Предоплата:</span>
                <div className="flex gap-4 justify-self-end font-inter">
                  <span className={twMerge(promoCode && 'line-through')}>{formatToRuble(booking.prePay)}</span>
                  {promoCode && (
                    <span>
                      {formatToRuble(
                        calculateDiscount({ price: booking.prePay, type: promoCode.type, discount: promoCode.discount })
                      )}
                    </span>
                  )}
                </div>
                <span>Всего:</span>
                <div className="flex gap-4 justify-self-end font-inter">
                  <span className={twMerge(promoCode && 'line-through')}>{formatToRuble(booking.total)}</span>
                  {promoCode && (
                    <span>
                      {formatToRuble(
                        calculateDiscount({ price: booking.total, type: promoCode.type, discount: promoCode.discount })
                      )}
                    </span>
                  )}
                </div>
              </div>
              <div className="py-5">
                <PaymentButtons
                  paymentType={paymentType}
                  prePay={unit?.entry.prePay}
                  token={token}
                  isPrePaid={booking.status === BookingStatus.PrePaid}
                />
              </div>
              <div className="pb-2 pt-5">
                <form action={pay}>
                  <SubmitButton>ОПЛАТИТЬ</SubmitButton>
                </form>
              </div>
              <span className="text-sm font-semibold text-tertiary">
                Вы также сможете оплатить на месте наличными или картой, когда приедете в “Ладога Парк”
              </span>
            </>
          )}
        </div>
        <div className="grid auto-rows-min grid-cols-2 gap-5 text-xl text-tertiary">
          <span>Фамилия и имя:</span>
          <span>{isAuthorized ? client?.name : `${client?.name[0]}***`}</span>
          <span>Телефон:</span>
          <span>{isAuthorized ? client.phone : `${client?.phone.slice(0, 3)}***`}</span>
          <span>E-mail:</span>
          <span>{isAuthorized ? client.email : `${client.email.slice(0, 2)}***`}</span>
          <span>Количество человек:</span>
          <span>{(unit?.entry.seats ?? 0) + booking.extraSeats}</span>
          <span>Парковочных мест:</span>
          <span>{booking.parking}</span>
        </div>
      </div>
    </main>
  );
};

export default Order;
