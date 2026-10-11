/**
 * Small, dependency-free validation helpers.
 *
 * Deliberately not a schema library: the project has two forms, and a
 * runtime validator would be more weight than the problem deserves.
 * The shape below (field -> error message) is what a resolver from
 * Zod or Yup would produce, so swapping one in later is mechanical.
 */

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export type Validator<T> = (values: T) => FieldErrors<T>;

/** Pragmatic address check — deliberately permissive. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Accepts international and Indian formats, ignoring spacing. */
const PHONE = /^[+]?[\d][\d\s()-]{7,16}\d$/;

export const isEmail = (value: string) => EMAIL.test(value.trim());
export const isPhone = (value: string) => PHONE.test(value.trim());
export const isBlank = (value: string) => value.trim().length === 0;

export function hasErrors<T>(errors: FieldErrors<T>): boolean {
    return Object.values(errors).some(Boolean);
}

/** 0–4, mirroring the four rules the strength meter displays. */
export function passwordScore(password: string): number {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
}

export const PASSWORD_LABELS = ['Weak', 'Fair', 'Good', 'Strong'] as const;
