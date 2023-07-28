import { Fragment } from 'react';
import { Transition } from '@headlessui/react';

type Props = { show: boolean; children: JSX.Element };

export default function AccordionTransition({ show, children }: Props) {
  return (
    <Transition
      as={Fragment}
      appear
      show={show}
      enter="ease-out duration-300"
      enterFrom="max-h-0"
      enterTo="max-h-[100px]"
      leave="ease-in duration-200"
      leaveFrom="max-h-[100px]"
      leaveTo="max-h-0"
    >
      <div className="overflow-hidden">{children}</div>
    </Transition>
  );
}
