'use client';

import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { sanitize } from 'isomorphic-dompurify';
import Image from 'next/image';
import { useState } from 'react';
import useSWRMutation from 'swr/mutation';
import Stepper from 'components/Stepper';
import { EntryWithFuturePricesWithGroup, EntryWithFuturePricesWithGroupWithServices } from 'core/types/Prisma';
import { Tab } from 'core/types/Tab';
import Button from 'ui/Button';
import { Input } from 'ui/Input';
import HouseTest from '../../../public/images/test-house.png';
import Bill from './Bill';
import BookingTabs from './BookingTabs';

type InfoProps = {
  entry: EntryWithFuturePricesWithGroup;
};
type Props = {
  entry: EntryWithFuturePricesWithGroupWithServices;
  tabs: Tab<string>[];
  isPaymentStep: boolean;
};
export type PaymentState = {
  total: number;
  startDate: Dayjs | null;
  nightsAmount: number;
  extraSeats: number;
  extraServicesTotal: number;
};

const Info = ({ entry }: InfoProps) => {
  return (
    <section className="flex flex-col gap-7">
      <div className="flex flex-col gap-5">
        <div>
          <Image src={HouseTest} alt="house image" className="w-full" />
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
const PaymentStep = ({ paymentInfo }: { paymentInfo: any }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const { trigger } = useSWRMutation('/api/bookings', (url, { arg }: { arg: BookingBody }) => {
    return axios.post<BookingBody>(url, arg);
  });

  const onSubmit = () => {
    // TODO: validation

    const body: BookingBody = {
      ...paymentInfo,
      sendEmail: true,
      start: paymentInfo.startDate?.format(),
      end: dayjs(paymentInfo.startDate).add(paymentInfo.nightsAmount, 'day').format(),
      extraSeats: paymentInfo.extraSeats,
      total: paymentInfo.total,

      client: {
        name,
        email,
        phone,
      },
    };

    trigger(body);
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

const BookingLayout = ({ entry, tabs, isPaymentStep }: Props) => {
  const [paymentState, setPaymentState] = useState<PaymentState>(() => ({
    total: 0,
    startDate: null,
    nightsAmount: 0,
    extraSeats: 0,
    extraServicesTotal: 0,
    parking: entry.parking,
    entryId: entry.id,
    unitId: entry.units[0].id,
  }));

  const MainStep = () => (
    <div className="mt-12 flex flex-col gap-5">
      <BookingTabs activeTab={String(entry.id)} tabs={tabs} />
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr]">
        <Info entry={entry} />
        <Bill entry={entry} paymentState={paymentState} setPaymentState={setPaymentState} />
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

  const content = [
    { content: <MainStep key="main-step" /> },
    { content: <PaymentStep paymentInfo={paymentState} key="payment-step" /> },
  ];

  return <Stepper steps={content} step={isPaymentStep ? 1 : 0} />;
};

export default BookingLayout;
