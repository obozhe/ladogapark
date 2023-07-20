import { stateContext } from 'containers/StateContext';
import { useContext } from 'react';

export const useStateContext = () => {
    const context = useContext(stateContext);

    if (!context) {
        throw new Error('Can not use `useStateContext` outside of the `StateContextProvider`');
    }

    return context;
};
