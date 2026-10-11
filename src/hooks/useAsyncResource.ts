import { useCallback, useEffect, useRef, useState } from 'react';

/** Discriminated union, so a component cannot read `data` while loading. */
export type AsyncState<T> =
    | { status: 'loading'; data: null; error: null }
    | { status: 'success'; data: T; error: null }
    | { status: 'error'; data: null; error: string };

const LOADING = { status: 'loading', data: null, error: null } as const;

export interface AsyncResource<T> {
    state: AsyncState<T>;
    /** Re-run the loader — wired to the Retry control in error states. */
    reload: () => void;
}

/**
 * Runs an async loader and tracks its lifecycle.
 *
 * `key` identifies the request. When it changes the hook resets to
 * loading **during render** rather than inside an effect: React
 * supports this adjust-state-on-prop-change pattern, and it avoids the
 * extra commit (and the stale frame of old data) that a setState in an
 * effect body produces.
 *
 * Results are applied in the promise callback and guarded by a
 * generation counter, so a slow first request can never overwrite a
 * fast second one.
 */
export function useAsyncResource<T>(
    loader: () => Promise<T>,
    key: string,
): AsyncResource<T> {
    const [state, setState] = useState<AsyncState<T>>(LOADING);
    const [activeKey, setActiveKey] = useState(key);
    const [nonce, setNonce] = useState(0);

    // Adjusting state during render when the request identity changes.
    if (key !== activeKey) {
        setActiveKey(key);
        setState(LOADING);
    }

    // The loader is usually an inline closure; keep the latest without
    // making it an effect dependency.
    const loaderRef = useRef(loader);
    useEffect(() => { loaderRef.current = loader; });

    const generation = useRef(0);

    useEffect(() => {
        const run = ++generation.current;
        let cancelled = false;

        loaderRef.current()
            .then(data => {
                if (cancelled || run !== generation.current) return;
                setState({ status: 'success', data, error: null });
            })
            .catch((err: unknown) => {
                if (cancelled || run !== generation.current) return;
                const message = err instanceof Error
                    ? err.message
                    : 'Something went wrong. Please try again.';
                setState({ status: 'error', data: null, error: message });
            });

        return () => { cancelled = true; };
    }, [key, nonce]);

    const reload = useCallback(() => setNonce(n => n + 1), []);

    return { state, reload };
}
