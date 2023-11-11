'use client';

import { sanitize } from 'isomorphic-dompurify';
import Image from 'next/image';
import { Commodity } from '@prisma/client';
import Stepper from 'components/Stepper';
import { EntryWithFuturePricesWithGroup, EntryWithFuturePricesWithGroupWithServices } from 'core/types/Prisma';
import { Tab } from 'core/types/Tab';
import HouseTest from '../../../public/images/test-house.png';
import Bill from './Bill';
import BookingTabs from './BookingTabs';
import PaymentStep from './PaymentStep';
import BookingStateProvider from './StateProvider';

type InfoProps = {
  entry: EntryWithFuturePricesWithGroup;
};
type Props = {
  entry: EntryWithFuturePricesWithGroupWithServices;
  tabs: Tab<string>[];
  isPaymentStep: boolean;
  commonCommodities: Commodity[];
};

const Info = ({ entry }: InfoProps) => {
  return (
    <section className="flex flex-col gap-7">
      <div className="flex flex-col gap-5">
        <div className="relative h-full w-full">
          <Image
            width={500}
            height={250}
            src={process.env.NEXT_PUBLIC_UPLOADS_URL + entry.images[0]}
            alt="house image"
            className="h-full w-full"
          />
        </div>
        <div className="flex gap-1 overflow-auto">
          <Image src={HouseTest} alt="house image" className="max-w-24 max-h-24" />
          <Image src={HouseTest} alt="house image" className="max-w-24 max-h-24" />
          <Image src={HouseTest} alt="house image" className="max-w-24 max-h-24" />
          <Image src={HouseTest} alt="house image" className="max-w-24 max-h-24" />
          <Image src={HouseTest} alt="house image" className="max-w-24 max-h-24" />
          <Image src={HouseTest} alt="house image" className="max-w-24 max-h-24" />
          <Image src={HouseTest} alt="house image" className="max-w-24 max-h-24" />
          <Image src={HouseTest} alt="house image" className="max-w-24 max-h-24" />
        </div>
      </div>
      <div className="hidden flex-col gap-2 font-semibold lg:flex">
        <p className="text-xl">{entry.title}</p>
        <p>{entry.description}</p>
        <div
          dangerouslySetInnerHTML={{
            __html: sanitize(entry.content),
          }}
        />
      </div>
    </section>
  );
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

const BookingLayout = ({ entry, tabs, isPaymentStep, commonCommodities }: Props) => {
  const content = [
    { content: <MainStep key="main-step" entry={entry} tabs={tabs} commonCommodities={commonCommodities} /> },
    {
      content: <PaymentStep key="payment-step" entry={entry} commonCommodities={commonCommodities} />,
    },
  ];

  return (
    <BookingStateProvider>
      <Stepper steps={content} step={isPaymentStep ? 1 : 0} />
    </BookingStateProvider>
  );
};

export default BookingLayout;
