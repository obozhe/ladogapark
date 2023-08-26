import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useTransition } from 'react';

type setQueryParamsArgs = { queryName: string; value: string }[];
type deleteQueryParamsArgs = string[];

const useRouterParams = (scroll = false) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransition, startTransition] = useTransition();

  const setQueryParams = useCallback(
    (...args: setQueryParamsArgs) => {
      const newSearchParams = new URLSearchParams();
      args.forEach(({ value, queryName }) => newSearchParams.set(queryName, value));

      startTransition(() => router.push(`${pathname}?${newSearchParams.toString()}`, { scroll }));
    },
    [router, pathname, scroll]
  );
  const deleteQueryParams = useCallback(
    (...args: deleteQueryParamsArgs) => {
      const newSearchParams = new URLSearchParams();
      args.forEach((queryName) => newSearchParams.delete(queryName));

      startTransition(() => router.push(`${pathname}?${newSearchParams.toString()}`, { scroll }));
    },
    [scroll, router, pathname]
  );

  return { setQueryParams, deleteQueryParams, isTransition };
};

export default useRouterParams;
