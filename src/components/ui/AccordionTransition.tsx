import { Fragment, ReactNode } from 'react';
import { Transition } from '@headlessui/react';

type Props = { show: boolean; children: ReactNode; maxHeight?: number };

export default function AccordionTransition({ show, children, maxHeight = 300 }: Props) {
  const maxHeightClass = `max-h-[${maxHeight}px]`;
  return (
    <Transition
      as={Fragment}
      show={show}
      enter="ease-out duration-300"
      enterFrom="max-h-0"
      enterTo={maxHeightClass}
      leave="ease-in duration-300"
      leaveFrom={maxHeightClass}
      leaveTo="max-h-0"
    >
      <div className="overflow-hidden">{children}</div>
    </Transition>
  );
}
