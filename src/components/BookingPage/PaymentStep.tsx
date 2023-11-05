import { Commodity } from '@prisma/client';
import { EntryWithFuturePricesWithGroupWithServices } from 'core/types/Prisma';
import DatePicker from 'ui/DatePicker';
import { Input } from 'ui/Input';
import NumberInput from 'ui/NumberInput';
import CommodityDisclosure from './CommodityDisclosure';
import EntryTypeCalendar from './EntryTypeCalendar';

type Props = {
  entry: EntryWithFuturePricesWithGroupWithServices;
  commonCommodities: Commodity[];
};

// TODO: think about move this component to pages and create a uniform interface
const PaymentStep = ({ entry, commonCommodities }: Props) => {
  //   const { trigger } = useSWRMutation('/api/bookings', (url, { arg }: { arg: CreateBookingBody }) => {
  //     return axios.post<CreateBookingBody>(url, arg);
  //   });

  const commoditiesDisclosure = [...commonCommodities, ...entry.extraCommodities].map((commodity) => ({
    name: commodity.title,
    price: commodity.price,
    max: Number.MAX_SAFE_INTEGER,
    onChange: (amount: 1 | -1) => {},
    isActive: true,
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

  return (
    <div className="grid grid-cols-3 gap-12">
      <div className="flex flex-col gap-4">
        <EntryTypeCalendar entry={entry} />
        <NumberInput placeholder="Дополнительные места" onChange={() => {}} />
        <CommodityDisclosure commodities={commoditiesDisclosure} />
      </div>
    </div>
  );
};

export default PaymentStep;
