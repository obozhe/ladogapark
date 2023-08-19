'use client';

import { useRouter } from 'next/navigation';
import { Tab } from 'core/types/Tab';
import Tabs from 'ui/Tabs';

type Props = {
  tabs: Tab[];
  activeTab: string;
};

const BookingTabs = ({ tabs, activeTab }: Props) => {
  const router = useRouter();

  return (
    <Tabs fullWidth={false} activeTab={activeTab} tabs={tabs} onClick={(value) => router.push(`/booking/${value}`)} />
  );
};

export default BookingTabs;
