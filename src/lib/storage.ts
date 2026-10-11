/**
 * localStorage helpers.
 *
 * Reads and writes are wrapped: storage throws in private-mode Safari
 * and when site data is blocked, and a persisted value can be corrupt
 * JSON from an older build. Neither should take the page down.
 */

export function readJson<T>(key: string, fallback: T): T {
    try {
        const raw = window.localStorage.getItem(key);
        return raw === null ? fallback : (JSON.parse(raw) as T);
    } catch {
        return fallback;
    }
}

export function writeJson(key: string, value: unknown): void {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
        /* Quota exceeded or storage unavailable — non-fatal. */
    }
}
