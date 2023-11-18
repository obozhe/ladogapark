'use client';

import { sanitize } from 'isomorphic-dompurify';
import Image from 'next/image';
import { useState } from 'react';
import { Commodity } from '@prisma/client';
import Stepper from 'components/Stepper';
import { CreateBookingBody } from 'core/types/Booking';
import { EntryWithFuturePricesWithGroup, EntryWithFuturePricesWithGroupWithServices } from 'core/types/Prisma';
import { Tab } from 'core/types/Tab';
import Bill from './Bill';
import BookingTabs from './BookingTabs';
import PaymentStep from './PaymentStep/PaymentStep';
import BookingStateProvider from './StateProvider';

type InfoProps = {
  entry: EntryWithFuturePricesWithGroup;
};
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

const Info = ({ entry }: InfoProps) => {
  const [mainImage, setMainImage] = useState(entry.images[0]);

  return (
    <section className="flex flex-col gap-7">
      <div className="flex flex-col gap-5">
        <div className="relative h-[450px]">
          <Image
            src={process.env.NEXT_PUBLIC_UPLOADS_URL + mainImage}
            alt="house image"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
            // width={600}
            // height={300}
            // style={{ objectFit: 'cover' }}
            style={{ objectFit: 'contain' }}
            // className="h-[450px] w-full"
          />
        </div>
        <div className="flex h-[70px] gap-1 overflow-auto md:h-[100px]">
          {entry.images.map((image) => {
            return (
              <Image
                key={image}
                src={process.env.NEXT_PUBLIC_UPLOADS_URL + image}
                alt="house image"
                width={150}
                height={50}
                className="w-[150px]"
                onClick={() => setMainImage(image)}
              />
            );
          })}
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
