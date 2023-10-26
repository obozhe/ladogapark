'use client';

import axios from 'axios';
import { sanitize } from 'isomorphic-dompurify';
import Image from 'next/image';
import { useState } from 'react';
import useSWRMutation from 'swr/mutation';
import { Commodity } from '@prisma/client';
import Stepper from 'components/Stepper';
import { CreateBookingBody } from 'core/types/Booking';
import { EntryWithFuturePricesWithGroup, EntryWithFuturePricesWithGroupWithServices } from 'core/types/Prisma';
import { Tab } from 'core/types/Tab';
import Button from 'ui/Button';
import { Input } from 'ui/Input';
import HouseTest from '../../../public/images/test-house.png';
import Bill from './Bill';
import BookingTabs from './BookingTabs';
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
  console.log(entry);
  return (
    <section className="flex flex-col gap-7">
      <div className="flex flex-col gap-5">
        <div className="relative h-full w-full">
          <Image
            width={0}
            height={0}
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
// TODO: think about move this component to pages and create a uniform interface
const PaymentStep = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const { trigger } = useSWRMutation('/api/bookings', (url, { arg }: { arg: CreateBookingBody }) => {
    return axios.post<CreateBookingBody>(url, arg);
  });

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
    <>
      <Input value={name} onChange={(e) => setName(e.target.value)} />
      <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
      <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      <Button onClick={() => onSubmit()}>Оплатить</Button>
    </>
  );
};

const BookingLayout = ({ entry, tabs, isPaymentStep, commonCommodities }: Props) => {
  const MainStep = () => (
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

  const content = [{ content: <MainStep key="main-step" /> }, { content: <PaymentStep key="payment-step" /> }];

  return (
    <BookingStateProvider>
      <Stepper steps={content} step={isPaymentStep ? 1 : 0} />
    </BookingStateProvider>
  );
};

export default BookingLayout;
