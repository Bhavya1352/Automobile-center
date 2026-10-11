import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Join conditional class names and let later Tailwind utilities win
 * over earlier ones in the same group, so a caller can override a
 * component's defaults by passing className.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
