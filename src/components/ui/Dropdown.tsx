'use client';

import Link from 'next/link';
import { Fragment, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { Menu, Transition } from '@headlessui/react';

type Props = {
  menuButton: ReactNode;
  links: { link: string; title: string }[];
  className?: string;
};

const DropDown = ({ menuButton, links, className }: Props) => {
  return (
    <Menu as="div" className={twMerge('relative inline-block text-left', className)}>
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md bg-opacity-20 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          {menuButton}
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          static
          className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-md bg-white p-4 pt-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          {links.map(({ link, title }, index) => (
            <Menu.Item key={'dropDownItem' + index}>
              {({ active }) => (
                <Link
                  href={link}
                  key={link}
                  className={twMerge(
                    'group flex w-full items-center border-b border-[#DDDDDD] px-2 py-2 text-sm font-bold text-gray-900',
                    active && 'bg-primary text-white'
                  )}
                >
                  {title}
                </Link>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default DropDown;
