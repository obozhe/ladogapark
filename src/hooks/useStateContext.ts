'use client';

import { useContext } from 'react';
import { stateContext } from 'containers/StateContext';

export const useStateContext = () => {
  const context = useContext(stateContext);

  if (!context) {
    throw new Error('`useStateContext` is outside of the `StateContextProvider`');
  }

  return context;
};
