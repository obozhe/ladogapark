import { useEffect, useRef, useState } from 'react';

import useLatest from './useLatest';

const useOutsideClick = <T extends HTMLElement>(onClick?: () => void) => {
    const [open, setOpen] = useState(false);

    const latestOnClick = useLatest(onClick);
    const ref = useRef<T>(null);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);

                if (latestOnClick.current) {
                    latestOnClick.current();
                }
            }
        };

        document.addEventListener('click', handleClick, true);

        return () => {
            document.removeEventListener('click', handleClick, true);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { open, setOpen, ref };
};

export default useOutsideClick;
