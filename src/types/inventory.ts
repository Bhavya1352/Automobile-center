/** Shared vehicle-shortlist types. */

/** Outcome of toggling a vehicle in the comparison tray, so the UI can
 *  report what happened rather than the context reaching for `alert()`. */
export type CompareToggleResult = 'added' | 'removed' | 'limit-reached';

export interface InventoryContextValue {
    wishlist: string[];
    isWishlisted: (id: string) => boolean;
    toggleWishlist: (id: string) => boolean;
    compareList: string[];
    isCompared: (id: string) => boolean;
    toggleCompare: (id: string) => CompareToggleResult;
    removeFromCompare: (id: string) => void;
    clearCompare: () => void;
}

/** Most comparison tables stop being readable past three columns. */
export const MAX_COMPARE = 3;
