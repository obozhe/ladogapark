'use client';

import { useStateContext } from 'hooks/useStateContext';
import Dialog from 'ui/Dialog';

export const ConfirmationDialog = () => {
  const {
    isOpen,
    close,
    props: { message, onSubmit, submitLabel },
  } = useStateContext();

  const submit = () => {
    onSubmit();
    close();
  };

  return (
    <Dialog title="Подтвердите действие" isOpen={isOpen} onClose={close} onSubmit={submit} submitLabel={submitLabel}>
      <p className="w-96">{message}</p>
    </Dialog>
  );
};
