'use client';

import { sanitize } from 'isomorphic-dompurify';
import { Commodity } from '@prisma/client';
import Stepper from 'components/Stepper';
import { CreateBookingBody } from 'core/types/Booking';
import { EntryWithFuturePricesWithGroupWithServices } from 'core/types/Prisma';
import { Tab } from 'core/types/Tab';
import Bill from './Bill';
import BookingTabs from './BookingTabs';
import Info from './Info';
import PaymentStep from './PaymentStep/PaymentStep';
import BookingStateProvider from './StateProvider';

type Props = {
  entry: EntryWithFuturePricesWithGroupWithServices;
  tabs: Tab<string>[];
  isPaymentStep: boolean;
  commonCommodities: Commodity[];
  onSubmit: (bookingBody: CreateBookingBody) => Promise<
    | {
        number: string;
        token: string;
      }
    | undefined
  >;
};

const MainStep = ({
  entry,
  tabs,
  commonCommodities,
}: {
  entry: EntryWithFuturePricesWithGroupWithServices;
  tabs: Tab<string>[];
  commonCommodities: Commodity[];
}) => (
  <div className="mt-12 flex flex-col gap-5">
    <BookingTabs activeTab={String(entry.id)} tabs={tabs} />
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr]">
      <Info entry={entry} />
      <Bill entry={entry} commonCommodities={commonCommodities} />

      <div className="mobile-container block flex-col gap-2 font-semibold lg:hidden ">
        <p className="text-xl">{entry.title}</p>
        <p>{entry.description}</p>
        <div
          dangerouslySetInnerHTML={{
            __html: sanitize(entry.content),
          }}
        />
      </div>
    </div>
  </div>
);

const BookingLayout = ({ entry, tabs, isPaymentStep, commonCommodities, onSubmit }: Props) => {
  const content = [
    { content: <MainStep key="main-step" entry={entry} tabs={tabs} commonCommodities={commonCommodities} /> },
    {
      content: (
        <PaymentStep key="payment-step" entry={entry} commonCommodities={commonCommodities} onSubmit={onSubmit} />
      ),
    },
  ];

  return (
    <BookingStateProvider>
      <Stepper steps={content} step={isPaymentStep ? 1 : 0} />
    </BookingStateProvider>
  );
};

export default BookingLayout;
