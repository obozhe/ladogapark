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
            'flex-1 cursor-pointer rounded-lg border-2 border-black bg-white px-2 py-1 text-center',
            active === tab.value && 'border-primary bg-primary text-white'
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
