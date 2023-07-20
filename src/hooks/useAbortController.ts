import { useRef, useEffect, useCallback } from 'react';

export const useAbortController = () => {
    const abortControllerRef = useRef<AbortController>(new AbortController());

    const newSignal = useCallback(() => {
        abortControllerRef.current = new AbortController();
        return abortControllerRef.current.signal;
    }, []);

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, []);

    return { signal: newSignal };
};
