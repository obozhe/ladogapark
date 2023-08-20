import { useEffect, useRef } from 'react';

const usePrevious = <T>(value: T) => {
  const previousValue = useRef<T | null>(null);

  useEffect(() => {
    previousValue.current = value;
  }, [value]);

  return previousValue.current;
};

export default usePrevious;
