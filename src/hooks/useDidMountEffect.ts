import { EffectCallback, useEffect } from 'react';

export const useDidMountEffect = (fn: EffectCallback) => {
    useEffect(() => {
        fn();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};
