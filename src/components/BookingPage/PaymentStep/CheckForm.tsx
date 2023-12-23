import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import CountUp from 'react-countup';
import { useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import usePrevious from 'hooks/usePrevious';
import { calculateDiscount } from 'core/helpers/number';
import { sourcePollItems } from 'core/sourcePollItems';
import { CreateBookingBody } from 'core/types/Booking';
import { EntryWithFuturePricesWithGroupWithServices } from 'core/types/Prisma';
import Button from 'ui/Button';
import SubmitButton from 'ui/SubmitButton';
import { useBookingState } from '../StateProvider';
import { TPaymentSchema } from './PaymentStep';

type Props = {
  entry: EntryWithFuturePricesWithGroupWithServices;
  onSubmit: (bookingBody: CreateBookingBody) => Promise<
    | {
        number: string;
        token: string;
      }
    | undefined
  >;
};

const CheckForm = ({ entry, onSubmit }: Props) => {
  const { bookingState } = useBookingState();
  const { handleSubmit, watch, setValue } = useFormContext<TPaymentSchema>();
  const prevBillInfoTotal = usePrevious(bookingState.total);
  const router = useRouter();

  let promoCodeTotal = null;
  let promoCodePrepayTotal = null;
  const prevPrepay =
    (prevBillInfoTotal ?? 0) - calculateDiscount({ price: prevBillInfoTotal, type: 'Percent', discount: entry.prePay });
  const prepay =
    (bookingState.total ?? 0) -
    calculateDiscount({ price: bookingState.total, type: 'Percent', discount: entry.prePay });
  const prevPromoCodeTotal = usePrevious(promoCodeTotal);
  const prevPromoCodePrepayTotal = usePrevious(promoCodePrepayTotal);
  const promoCode = watch('promoCode');

  if (promoCode) {
    promoCodeTotal = calculateDiscount({
      price: bookingState.total,
      type: promoCode.type,
      discount: promoCode.discount,
    });
    promoCodePrepayTotal = calculateDiscount({
      price: prepay,
      type: promoCode.type,
      discount: promoCode.discount,
    });
  }

  const submit = handleSubmit(async (data) => {
    const bookingBody: CreateBookingBody = {
      start: bookingState.start!.toISOString(),
      end: bookingState.end!.toISOString(),
      total: bookingState.total,
      prePay: (bookingState.total / 100) * entry.prePay,
      extraSeats: bookingState.extraSeats,
      commoditiesOrder: Object.entries(bookingState.commoditiesOrder).map((entries) => ({
        id: entries[0],
        count: entries[1],
      })),
      unitId: bookingState.unitId!,
      entryId: entry.id,

      commoditiesOrderTotal: bookingState.commoditiesOrderTotal,

      parking: entry.parking,

      sourcePoll: data.sourcePoll,
      comment: data.comment,
      promoCodeId: data.promoCode?.id,

      client: {
        name: data.name + data.surname,
        email: data.email,
        phone: data.phone,
      },
    };

    try {
      const booking = await onSubmit(bookingBody);
      router.push(`/orders/${booking?.number}?token=${booking?.token}`);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <div className="flex flex-col border-t-2 [&>*:nth-last-child(n+3)]:border-b-2">
      <span className="py-3 font-semibold">
        Заезд - {dayjs(bookingState.start).format('D MMMM')} c {entry.group.startHour}:00
      </span>
      <span className="py-3 font-semibold">
        Выезд - {dayjs(bookingState.end).format('D MMMM')} c {entry.group.endHour}:00
      </span>
      <div className="grid grid-cols-[max-content,1fr] gap-5 py-5 text-2xl">
        <span className="font-semibold">Предоплата:</span>
        <div className="flex gap-4 justify-self-end font-inter">
          <CountUp
            start={prevPrepay}
            end={prepay}
            suffix=" ₽"
            duration={0.5}
            className={twMerge(promoCodePrepayTotal && 'line-through')}
          />
          {promoCodePrepayTotal && (
            <CountUp start={prevPromoCodePrepayTotal ?? 0} end={promoCodePrepayTotal} suffix=" ₽" duration={0.5} />
          )}
        </div>
        <span className="font-semibold">Итого:</span>
        <div className="flex gap-4 justify-self-end font-inter">
          <CountUp
            start={prevBillInfoTotal ?? 0}
            end={bookingState.total}
            suffix=" ₽"
            duration={0.5}
            className={twMerge(promoCodeTotal && 'line-through')}
          />
          {promoCodeTotal && (
            <CountUp start={prevPromoCodeTotal ?? 0} end={promoCodeTotal} suffix=" ₽" duration={0.5} />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 py-5  font-semibold">
        <span className="text-lg">Откуда вы о нас узнали?</span>
        <div className="flex gap-4">
          {sourcePollItems.map(({ icon, activeIcon, type, title }) => {
            const Icon = watch('sourcePoll') === type ? activeIcon : icon;

            return (
              <div key={title} className="flex flex-col items-center gap-[5px]">
                <span className="cursor-pointer" onClick={() => setValue('sourcePoll', type)}>
                  <Icon />
                </span>
                <span>{title}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {/* @ts-ignore */}
        <form action={submit}>
          <SubmitButton>Оплатить</SubmitButton>
        </form>
        <p className="text-sm font-semibold text-tertiary">
          Бронируя данный объект, вы подтверждаете своё согласие с договором оферты.
        </p>
      </div>
    </div>
  );
};

export default CheckForm;
