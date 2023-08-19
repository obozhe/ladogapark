import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useTransition } from 'react';

type CallbackArgs = { queryName: string; value: string }[];

const useRouterParams = (scroll = false) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransition, startTransition] = useTransition();

  const callback = useCallback(
    (...args: CallbackArgs) => {
      const newSearchParams = new URLSearchParams();
      args.forEach(({ value, queryName }) => newSearchParams.set(queryName, value));

      startTransition(() => router.push(`${pathname}?${newSearchParams.toString()}`, { scroll }));
    },
    [router, pathname, scroll]
  );

  return { callback, isTransition };
};

export default useRouterParams;
