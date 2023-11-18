import { useCallback, useMemo } from 'react';
import useLatest from './useLatest';

const debounce = <T extends Function>(fn: T, ms = 300) => {
  let timeoutId: number | null = null;

  //@ts-ignore
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
    }, ms) as unknown as number;
  };
};

const useDebounce = <T extends Function>(cb: T, ms = 300) => {
  const latestCb = useLatest(cb);
  const memoizedCb = useMemo(() => debounce(latestCb.current, ms), [latestCb, ms]);

  return memoizedCb;
};

export default useDebounce;
