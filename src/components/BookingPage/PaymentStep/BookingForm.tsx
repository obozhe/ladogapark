import { Commodity } from '@prisma/client';
import { CreateBookingBody } from 'core/types/Booking';
import { EntryWithFuturePricesWithGroupWithServices } from 'core/types/Prisma';
import NumberInput from 'ui/NumberInput';
import CommodityDisclosure from '../CommodityDisclosure';
import EntryTypeCalendar from '../EntryTypeCalendar';
import { useBookingState } from '../StateProvider';

type Props = {
  entry: EntryWithFuturePricesWithGroupWithServices;
  commonCommodities: Commodity[];
};

const BookingForm = ({ entry, commonCommodities }: Props) => {
  const { bookingState, updateExtraSeats, updateServicesAmount } = useBookingState();

  const commoditiesDisclosure = [...commonCommodities, ...entry.extraCommodities].map((commodity) => ({
    name: commodity.title,
    price: commodity.price,
    max: Number.MAX_SAFE_INTEGER,
    onChange: (amount: 1 | -1) => updateServicesAmount({ amount, price: commodity.price, id: commodity.id }),
    isActive: true,
    value: bookingState.commoditiesOrder[commodity.id],
  }));

  return (
    <div className="flex flex-col gap-4">
      <EntryTypeCalendar entry={entry} className="h-fit" />
      <NumberInput
        className="h-fit rounded-[10px] border-2 border-black"
        placeholder="Дополнительные места"
        value={bookingState.extraSeats}
        onChange={(amount) => updateExtraSeats(amount, entry.priceExtraSeat)}
        max={entry.extraSeats}
      />
      <CommodityDisclosure commodities={commoditiesDisclosure} />
    </div>
  );
};

export default BookingForm;
