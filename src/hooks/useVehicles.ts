import { fetchAllCars, fetchCarById, fetchFilteredCars } from '../services/carService';
import type { Car, FetchCarsParams } from '../services/carService';
import { useAsyncResource } from './useAsyncResource';
import type { AsyncResource } from './useAsyncResource';

/**
 * Vehicle data access. Components use these rather than importing the
 * service directly, so replacing the mock with a real endpoint is a
 * change confined to services/ and this file.
 *
 * The loader closures are intentionally not memoised: useAsyncResource
 * holds the latest in a ref and re-runs only when `key` changes.
 */

export function useVehicles(params: FetchCarsParams): AsyncResource<Car[]> {
    return useAsyncResource(() => fetchFilteredCars(params), JSON.stringify(params));
}

export interface VehicleDetail {
    car: Car | null;
    similar: Car[];
}

/** How many "similar vehicles" to show beneath a detail page. */
const SIMILAR_COUNT = 3;

export function useVehicleDetail(id: string): AsyncResource<VehicleDetail> {
    return useAsyncResource(async (): Promise<VehicleDetail> => {
        const [car, all] = await Promise.all([fetchCarById(id), fetchAllCars()]);
        if (!car) return { car: null, similar: [] };
        const similar = all
            .filter(c => c.id !== car.id && (c.type === car.type || c.brand === car.brand))
            .slice(0, SIMILAR_COUNT);
        return { car, similar };
    }, id);
}
