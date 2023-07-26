'use client';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import { ChevronDownIcon, Settings } from 'lucide-react';
import { Fragment } from 'react';
import Button from './Button';

type Props = {
  buttonComponent: JSX.Element;
  menuItems: {
    label: string;
    onClick?: () => void;
  }[];
};

export default function Menu({ buttonComponent, menuItems }: Props) {
  return (
    <HeadlessMenu as="div" className="relative inline-block text-left">
      <HeadlessMenu.Button className="w-full flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary">
        {buttonComponent}
      </HeadlessMenu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <HeadlessMenu.Items className="absolute z-10 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {menuItems.map(({ label, onClick }, i) => (
            <HeadlessMenu.Item key={i}>
              <div className="w-full">
                <Button fullWidth className="justify-start rounded-none" onClick={onClick}>
                  {label}
                </Button>
              </div>
            </HeadlessMenu.Item>
          ))}
        </HeadlessMenu.Items>
      </Transition>
    </HeadlessMenu>
  );
}
