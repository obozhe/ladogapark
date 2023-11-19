'use client';

import { IconCircleArrowDown } from '@tabler/icons-react';
import { ReactNode, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Disclosure as DisclosureUI } from '@headlessui/react';

type Props = {
  title: ReactNode;
  description: ReactNode;
  showIcon?: boolean;
  className?: string;
  endAdornment?: ReactNode;
};

const Disclosure = ({ title, description, showIcon = true, className, endAdornment }: Props) => {
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
                  <IconCircleArrowDown size={30} />
                </span>
              )}
              {!showIcon && endAdornment}
            </DisclosureUI.Button>
            <DisclosureUI.Panel
              static
              ref={panelRef}
              className="overflow-hidden font-semibold transition-[max-height] duration-300 ease-out"
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
