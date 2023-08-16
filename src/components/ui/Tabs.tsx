import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  tabs: { label: string; value: string }[];
  activeTab?: string | null;
  onChange?: () => void;
};

const Tabs = ({ tabs, activeTab = null }: Props) => {
  const [active, setActive] = useState<string | null>(activeTab);

  return (
    <div className="grid grid-rows-1 gap-4" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
      {tabs.map((tab, index) => (
        <div
          key={`${tab.value}-${index}`}
          className={twMerge(
            'flex-1 text-center cursor-pointer bg-white border-2 rounded-lg border-black px-2 py-1',
            active === tab.value && 'bg-primary text-white border-primary'
          )}
          onClick={() => setActive(tab.value)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
