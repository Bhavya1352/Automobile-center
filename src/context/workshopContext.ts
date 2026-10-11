import { createContext } from 'react';
import type { WorkshopContextValue } from '../types/workshop';

/** Context object only — the provider lives in WorkshopProvider.tsx and
 *  the reader hook in hooks/useWorkshop.ts, so Fast Refresh can treat
 *  each file as a single kind of export. */
export const WorkshopContext = createContext<WorkshopContextValue | undefined>(undefined);
