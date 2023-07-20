import { useLayoutEffect, useRef } from 'react';

const useLatest = <T>(value: T) => {
    const latestValue = useRef(value);

    useLayoutEffect(() => {
        latestValue.current = value;
    }, [value]);

    return latestValue;
};

export default useLatest;
