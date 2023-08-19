import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Tab } from 'core/types/Tab';

type Props<T> = {
  tabs: Tab<T>[];
  activeTab?: T | null;
  onClick: (value: T) => void;
  className?: string;
};

const Tabs = <T,>({ tabs, activeTab = null, onClick, className }: Props<T>) => {
  const [active, setActive] = useState<T | null>(activeTab);

  return (
    <div
      className={twMerge('grid grid-rows-1 gap-4', className)}
      style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
    >
      {tabs.map((tab, index) => (
        <div
          key={`${tab.value}-${index}`}
          className={twMerge(
            'flex-1 text-center cursor-pointer bg-white border-2 rounded-lg border-black px-2 py-1',
            active === tab.value && 'bg-primary text-white border-primary'
          )}
          onClick={() => {
            onClick(tab.value);
            setActive(tab.value);
          }}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
