import { Fragment, ReactNode } from 'react';
import { Transition } from '@headlessui/react';

type Props = { show: boolean; children: ReactNode; maxHeight?: number };

export default function AccordionTransition({ show, children }: Props) {
  return (
    <Transition
      as={Fragment}
      show={show}
      enter="ease-out duration-300"
      enterFrom="max-h-0"
      enterTo="max-h-[300px]"
      leave="ease-in duration-300"
      leaveFrom="max-h-[300px]"
      leaveTo="max-h-0"
    >
      <div className="overflow-hidden">{children}</div>
    </Transition>
  );
}
