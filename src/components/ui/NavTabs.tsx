'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

type Props = { tabs: { label: string; path: string }[]; vertical?: boolean };

export default function NavTabs({ tabs, vertical = false }: Props) {
  const pathname = usePathname();

  return (
    <div className="w-full max-w-md px-2 sm:px-0">
      <div className={twMerge('flex', vertical ? 'flex-col' : 'flex-row')}>
        {tabs.map((tab, i) => (
          <Link
            href={tab.path}
            key={`${tab.label}-${tab.path}-${i}`}
            className={twMerge(
              'p-2 leading-5 text-left rounded',
              pathname.includes(tab.path) ? 'text-white' : 'text-gray-400 hover:bg-white/[0.12] hover:text-white'
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
