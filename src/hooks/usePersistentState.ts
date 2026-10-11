import { useCallback, useEffect, useState } from 'react';
import { readJson, writeJson } from '../lib/storage';

/**
 * usePersistentState — useState that survives a refresh.
 *
 * For the small per-browser preferences the dashboards hold: the
 * profile fields on the settings tab, the notification switches, the
 * admin's workshop details. Anything the product would consider real
 * records goes through WorkshopProvider instead.
 *
 * Reads and writes go through lib/storage, so blocked site data or a
 * corrupt value from an older build falls back rather than throwing.
 */
export function usePersistentState<T>(key: string, initial: T) {
    const [value, setValue] = useState<T>(() => readJson(key, initial));

    useEffect(() => { writeJson(key, value); }, [key, value]);

    /** Written through rather than left to the effect above: a reset is
     *  usually fired alongside something that unmounts this component —
     *  the dashboard's own reset drops back to its loading state — and
     *  the effect would never run to clear the stored value. */
    const reset = useCallback(() => {
        writeJson(key, initial);
        setValue(initial);
    }, [key, initial]);

    return [value, setValue, reset] as const;
}
