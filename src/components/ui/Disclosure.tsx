'use client';

import { ReactNode, useRef, useState } from 'react';
import { ArrowDownCircle } from 'tabler-icons-react';
import { twMerge } from 'tailwind-merge';
import { Disclosure as DisclosureUI } from '@headlessui/react';

type Props = {
  title: ReactNode;
  description: ReactNode;
  showIcon?: boolean;
  className?: string;
};

const Disclosure = ({ title, description, showIcon = true, className }: Props) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [maxHeight, setMaxHeight] = useState<string | 0>(0);

  return (
    <div className={twMerge('w-full', className)}>
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
                <span className={twMerge('transition', open && 'rotate-180')}>
                  <ArrowDownCircle size={30} />
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
