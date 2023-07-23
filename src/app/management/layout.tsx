import type { Metadata } from 'next';
import NavTabs from 'ui/NavTabs';

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
      <div className="bg-black relative">
        <div className="fixed w-[260px] p-4">
          <NavTabs tabs={tabs} vertical />
        </div>
      </div>

      <div className="px-8 py-4 bg-gray-200">{children}</div>
    </div>
  );
}
