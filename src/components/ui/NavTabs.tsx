'use client';

import { Tab } from '@headlessui/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

type Props = { tabs: { label: string; path: string }[]; vertical?: boolean };

export default function NavTabs({ tabs, vertical = false }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const onSelect = (index: number) => router.push(tabs[index].path);

  return (
    <div className="w-full max-w-md px-2 sm:px-0">
      <Tab.Group vertical={vertical} manual onChange={onSelect}>
        <Tab.List className={twMerge('flex', vertical ? 'flex-col' : 'flex-row')}>
          {tabs.map((tab, i) => (
            <Tab
              key={`${tab.label}-${tab.path}-${i}`}
              className={twMerge(
                'p-2 leading-5 text-left rounded',
                'ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                pathname === tab.path ? 'text-white' : 'text-gray-400 hover:bg-white/[0.12] hover:text-white'
              )}
            >
              {tab.label}
            </Tab>
          ))}
        </Tab.List>
      </Tab.Group>
    </div>
  );
}
