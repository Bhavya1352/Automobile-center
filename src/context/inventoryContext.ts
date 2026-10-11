import { createContext } from 'react';
import type { InventoryContextValue } from '../types/inventory';

/** Context object only — the provider lives in InventoryProvider.tsx
 *  and the reader hook in hooks/useInventory.ts, so Fast Refresh can
 *  treat each file as a single kind of export. */
export const InventoryContext = createContext<InventoryContextValue | undefined>(undefined);
