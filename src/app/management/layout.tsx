import Header from 'components/Header/Header';
import type { Metadata } from 'next';
import { Inter, Raleway } from 'next/font/google';
import { twMerge } from 'tailwind-merge';
import NavTabs from 'ui/NavTabs';

const raleway = Raleway({ subsets: ['latin'], variable: '--raleway' });
const inter = Inter({ subsets: ['latin'], variable: '--inter' });

export const metadata: Metadata = {
  title: 'CRM Ладога парк',
};

const tabs = [
  {
    label: 'Объекты',
    path: '/management/objects',
  },
  {
    label: 'Пользователи',
    path: '/management/users',
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full grid grid-cols-[260px,_1fr]">
      <div className="p-4 bg-black">
        <NavTabs tabs={tabs} vertical />
      </div>

      <div className="p-4">{children}</div>
    </div>
  );
}
