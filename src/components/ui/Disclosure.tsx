'use client';

import { Disclosure as DisclosureUI, Transition } from '@headlessui/react';
import ArrowCircleIcon from 'icons/arrow-circle.svg';
import { ReactNode, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  title: ReactNode;
  description: ReactNode;
  showIcon?: boolean;
};

const Disclosure = ({ title, description, showIcon = true }: Props) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [maxHeight, setMaxHeight] = useState<string | 0>(0);

  return (
    <div className="w-full border-t-2 border-black last:border-b-2 py-4">
      <DisclosureUI>
        {({ open }) => (
          <>
            <DisclosureUI.Button
              className="flex w-full justify-between"
              onClick={() =>
                setMaxHeight((prev) => (prev === 0 ? (panelRef?.current?.scrollHeight ?? 0) + 32 + 'px' : 0))
              }
            >
              {title}
              {showIcon && (
                <span className={twMerge('rotate-180 transition', open && 'rotate-0')}>
                  <ArrowCircleIcon />
                </span>
              )}
            </DisclosureUI.Button>
            <DisclosureUI.Panel
              static
              ref={panelRef}
              className="font-semibold transition-[max-height] overflow-hidden duration-300 ease-out"
              style={{ maxHeight }}
            >
              <div className="py-4">{description}</div>
            </DisclosureUI.Panel>
          </>
        )}
      </DisclosureUI>
    </div>
  );
};

export default Disclosure;
