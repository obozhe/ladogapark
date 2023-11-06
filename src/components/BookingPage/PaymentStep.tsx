import dayjs from 'dayjs';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { Commodity } from '@prisma/client';
import useRouterParams from 'hooks/useRouterParams';
import formatToRuble from 'core/helpers/number';
import { EntryWithFuturePricesWithGroupWithServices } from 'core/types/Prisma';
import DatePicker from 'ui/DatePicker';
import { Input } from 'ui/Input';
import NumberInput from 'ui/NumberInput';
import CommodityDisclosure from './CommodityDisclosure';
import EntryTypeCalendar from './EntryTypeCalendar';
import { useBookingState } from './StateProvider';

dayjs.locale('ru');

type Props = {
  entry: EntryWithFuturePricesWithGroupWithServices;
  commonCommodities: Commodity[];
};

// TODO: think about move this component to pages and create a uniform interface
const PaymentStep = ({ entry, commonCommodities }: Props) => {
  //   const { trigger } = useSWRMutation('/api/bookings', (url, { arg }: { arg: CreateBookingBody }) => {
  //     return axios.post<CreateBookingBody>(url, arg);
  //   });
  const { bookingState } = useBookingState();
  const { deleteQueryParams } = useRouterParams();

  const commoditiesDisclosure = [...commonCommodities, ...entry.extraCommodities].map((commodity) => ({
    name: commodity.title,
    price: commodity.price,
    max: Number.MAX_SAFE_INTEGER,
    onChange: (amount: 1 | -1) => {},
    isActive: true,
    value: bookingState.services[commodity.title],
  }));

  const onSubmit = () => {
    // // TODO: validation
    // const body: BookingBody = {
    //   ...paymentInfo,
    //   sendEmail: true,
    //   start: paymentInfo.startDate?.format(),
    //   end: dayjs(paymentInfo.startDate).add(paymentInfo.nightsAmount, 'day').format(),
    //   extraSeats: paymentInfo.extraSeats,
    //   total: paymentInfo.total,
    //   client: {
    //     name,
    //     email,
    //     phone,
    //   },
    // };
    // trigger(body);
  };

  useEffect(() => {
    if (!bookingState.start) {
      deleteQueryParams('isPayment');
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingState.start]);

  return (
    <div className="flex gap-12 [&>*]:basis-1/3">
      <div className="flex flex-col gap-4">
        <EntryTypeCalendar entry={entry} />
        <NumberInput
          className="h-fit"
          placeholder="Дополнительные места"
          value={bookingState.extraSeats}
          onChange={() => {}}
        />
        <CommodityDisclosure commodities={commoditiesDisclosure} />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <Input placeholder="Имя" _size="xxl" disableHelper />
          <Input placeholder="Фамилия" _size="xxl" disableHelper />
        </div>
        <Input placeholder="Телефон" disableHelper _size="xxl" />
        <Input
          _size="xxl"
          placeholder="E-mail"
          helper="На E-mail придёт письмо с информацией о вашем бронировании и чек об оплате. Если вы не хотите получать эти письма, поле E-mail оставьте пустым."
        />
      </div>
      <div className="flex flex-col border-t-2 [&>*]:border-b-2">
        <span className="py-3 font-semibold">{dayjs(bookingState.start).format('D MMMM')} c 15:00</span>
        <span className="py-3 font-semibold">{dayjs(bookingState.end).format('D MMMM')} c 15:00</span>
        <div className="grid grid-cols-2 gap-5 py-5 text-2xl">
          <span className="font-semibold">Предоплата:</span>
          <span className="justify-self-end font-inter">{formatToRuble(bookingState.total / 2)}</span>
          <span className="font-semibold">Итого:</span>
          <span className="justify-self-end font-inter">{formatToRuble(bookingState.total)}</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;
