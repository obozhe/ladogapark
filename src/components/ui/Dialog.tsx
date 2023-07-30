import { Fragment, ReactNode } from 'react';
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react';
import BlockLoader from './BlockLoader';
import Button from './Button';

type Props = {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  title?: string;
  onSubmit?: (...args: any[]) => void;
  submitLabel?: string;
  disabled?: boolean;
  disableActions?: boolean;
  children: ReactNode;
};

const Dialog = ({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  disabled,
  disableActions,
  isLoading,
  submitLabel = 'Сохранить',
}: Props) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <HeadlessDialog className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center md:p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div>
                <BlockLoader isLoading={isLoading || false}>
                  <HeadlessDialog.Panel className="w-fit transform rounded bg-white text-left align-middle shadow-xl transition-all">
                    {title && (
                      <HeadlessDialog.Title as="h3" className="text-xl font-semibold leading-6 p-4 border-b">
                        {title}
                      </HeadlessDialog.Title>
                    )}
                    <div className="p-4">{children}</div>

                    {!disableActions && (
                      <div className="flex gap-2 border-t p-4 justify-end">
                        <Button onClick={onClose} color="secondary">
                          Отмена
                        </Button>
                        <Button
                          disabled={disabled}
                          color="primary"
                          type="button"
                          onClick={onSubmit}
                          className="-order-1 sm:order-1"
                        >
                          {submitLabel}
                        </Button>
                      </div>
                    )}
                  </HeadlessDialog.Panel>
                </BlockLoader>
              </div>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition>
  );
};

export default Dialog;
