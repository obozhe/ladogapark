type RefItem<T> = ((element: T | null) => void) | React.MutableRefObject<T | null> | null | undefined;

const mergeRefs = <T>(...refs: RefItem<T>[]) => {
  const refCb = (element: T | null) => {
    refs.forEach((ref) => {
      if (!ref) {
        return;
      }

      if (typeof ref === 'function') {
        ref(element);
      } else {
        ref.current = element;
      }
    });
  };

  return refCb;
};

export default mergeRefs;
