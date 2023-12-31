'use client';

import { useRouter } from 'next/navigation';
import { Tab } from 'core/types/Tab';
import Tabs from 'ui/Tabs';

type Props = {
  tabs: Tab<string>[];
  activeTab: string;
};

const BookingTabs = ({ tabs, activeTab }: Props) => {
  const router = useRouter();

  return (
    <Tabs
      className="mobile-container w-max"
      activeTab={activeTab}
      tabs={tabs}
      onClick={(value) => router.push(`/booking/${value}`)}
    />
  );
};

export default BookingTabs;
