import { debounce } from 'lodash';
import { useMemo } from 'react';

import useLatest from './useLatest';

const useDebounce = <T>(cb: (...args: any[]) => T, ms = 300) => {
  const latestCb = useLatest(cb);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => debounce((...args: any) => latestCb.current(...args), ms), [ms]);
};

export default useDebounce;
