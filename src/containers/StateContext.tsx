'use client';

import { ReactNode, createContext, useState } from 'react';

export enum DialogNames {
  CreateUnit = 'CreateUnit',
  EditUnitNumber = 'EditUnitNumber',
  TemporaryCloseUnit = 'TemporaryCloseUnit',
}

type State = {
  dialog: {
    isOpen: boolean;
    name: DialogNames | null;
    props: Record<string, any>;
  };
};

type TStateContext = {
  isOpen: boolean;
  open: (name: DialogNames, dialogProps?: Record<string, any>) => void;
  close: () => void;
  name: DialogNames | null;
  props: Record<string, any>;
} | null;

export const stateContext = createContext<TStateContext | null>(null);

const StateContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<State>({
    dialog: {
      isOpen: false,
      name: null,
      props: {},
    },
  });

  const open = (dialogName: DialogNames, dialogProps?: Record<string, unknown>) => {
    setState((prev) => ({ ...prev, dialog: { isOpen: true, props: dialogProps ?? {}, name: dialogName } }));
  };

  const close = () => {
    setState((prev) => ({ ...prev, dialog: { ...prev.dialog, isOpen: false } }));
    setTimeout(() => {
      setState((prev) => ({ ...prev, dialog: { ...prev.dialog, name: null, props: {} } }));
    }, 200);
  };

  return (
    <stateContext.Provider
      value={{
        isOpen: state.dialog.isOpen,
        props: state.dialog.props,
        name: state.dialog.name,
        open,
        close,
      }}
    >
      {children}
    </stateContext.Provider>
  );
};

export default StateContextProvider;
