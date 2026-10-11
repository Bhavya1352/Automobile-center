/**
 * carService.ts — Simulates a real REST API layer.
 * 
 * In production, you'd replace the body of each function with
 * actual fetch('/api/cars') calls. The component code stays
 * identical — that's the power of this abstraction.
 * 
 * Simulates: network latency, error handling, pagination.
 */

import { CARS } from '../data/carsData';
import type { Car, FetchCarsParams, VehicleSort } from '../types/vehicle';

export type { Car, FetchCarsParams, VehicleSort };

/** Stand-in for real network latency, so loading states are exercised
 *  in development rather than flashing past. */
const MIN_LATENCY_MS = 200;
const LATENCY_JITTER_MS = 400;

const simulateLatency = () =>
    new Promise<void>(resolve =>
        setTimeout(resolve, MIN_LATENCY_MS + Math.random() * LATENCY_JITTER_MS)
    );

/**
 * Fetches all vehicles — simulates GET /api/vehicles
 * In production: fetch('https://api.autosphere.com/v1/vehicles')
 */
export async function fetchAllCars(): Promise<Car[]> {
    await simulateLatency();
    return [...CARS]; // Return copy to prevent mutation
}

/**
 * Fetches a single vehicle by ID — simulates GET /api/vehicles/:id
 * In production: fetch(`https://api.autosphere.com/v1/vehicles/${id}`)
 */
export async function fetchCarById(id: string): Promise<Car | null> {
    await simulateLatency();
    return CARS.find(c => c.id === id) ?? null;
}

/**
 * Search + filter + sort — simulates GET /api/vehicles?q=&type=&maxPrice=&sort=
 * All filtering happens server-side in production.
 */

export async function fetchFilteredCars(params: FetchCarsParams): Promise<Car[]> {
    await simulateLatency();

    let results = [...CARS];

    if (params.search) {
        const q = params.search.toLowerCase();
        results = results.filter(
            car => car.name.toLowerCase().includes(q) ||
                   car.brand.toLowerCase().includes(q)
        );
    }

    if (params.type && params.type !== 'All') {
        results = results.filter(car => car.type === params.type);
    }

    if (params.maxPrice !== undefined) {
        const max = params.maxPrice;
        results = results.filter(car => car.price <= max);
    }

    switch (params.sort) {
        case 'price-asc': results.sort((a, b) => a.price - b.price); break;
        case 'price-desc': results.sort((a, b) => b.price - a.price); break;
        case 'hp-desc': results.sort((a, b) => b.hp - a.hp); break;
        default: results.sort((a, b) => a.price - b.price);
    }

    return results;
}
