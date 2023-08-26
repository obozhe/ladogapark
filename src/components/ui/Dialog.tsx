import parse from 'html-react-parser';
import { sanitize } from 'isomorphic-dompurify';
import { Fragment } from 'react';
import { Dialog as DialogLib, Transition } from '@headlessui/react';

type Props = {
  closeModal: () => void;
  isOpen: boolean;
  title: string;
  content: string;
};

let currentContent = '';
let currentTitle = '';

const Dialog = ({ isOpen, closeModal, title, content }: Props) => {
  currentContent = content ?? currentContent;
  currentTitle = title ?? currentTitle;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <DialogLib as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogLib.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogLib.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  {currentTitle}
                </DialogLib.Title>
                <div className="mt-2">{parse(sanitize(currentContent))}</div>

                {/* <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    Got it, thanks!
                  </button>
                </div> */}
              </DialogLib.Panel>
            </Transition.Child>
          </div>
        </div>
      </DialogLib>
    </Transition>
  );
};

export default Dialog;
